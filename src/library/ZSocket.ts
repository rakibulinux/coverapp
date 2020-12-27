import ZSmartModel from "@zsmartex/z-eventbus";
import UserController from '@/controllers/user';
import { PublicController, TradeController } from '@/controllers';

class ZSocket {
  [key: string]: any;

  url: string;
  type: string;
  callback?: Function;
  socket!: WebSocket;

  is_connected = false;
  allow_reconnect = true;
  channels: string[] = [];

  constructor(url: string, callback?: Function, type = "public") {
    this.url = url;
    this.type = type;
    this.callback = callback;
  }

  get is_open() {
    return this.socket.readyState === 1;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  connect() {
    this.socket = new WebSocket(this.url);

    ["onopen", "onclose", "onerror", "onmessage"].forEach(name => {
      if (this.socket)
        (this.socket as any)[name] = (...args: any) => this[name](...args);
    });
  }

  start_ping() {
    const ping_interval = setInterval(() => {
      if (!this.is_open) {
        return clearInterval(ping_interval);
      }

      this.ping();
    }, 60000);
  }

  onopen() {
    this.is_connected = true;
    this.start_ping();
    if (typeof this.callback === "function") this.callback(this);

    this.channels.forEach(channel => {
      this.subscribe(channel);
    });
  }

  async onclose() {
    this.is_connected = false;
    setTimeout(() => {
      if (!this.allow_reconnect) return;

      this.connect();
    }, 2000);
  }

  onerror() {
    this.socket.close();
  }

  onmessage(message) {
    let payload: { [pair: string]: any } = {};

    try {
      if (message.data === "pong") return;
      payload = JSON.parse(message.data);
    } catch (error) {
      window.console.error(`Error parsing : ${error.data}`);
    }

    for (const routingKey in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, routingKey)) {
        const event = payload[routingKey];

        const subscribedMatch = routingKey === "success" && event["message"] === "subscribed";
        const unsubscribedMatch = routingKey === "success" && event["message"] === "unsubscribed";
        const klineMatch = routingKey.match(/([^.]*)\.kline-(.+)/);
        const tradesMatch = routingKey.match(/([^.]*)\.trades/);
        const depthUpdateMatch = routingKey.match(/([^.]*)\.depth/);
        const balanceUpdateMatch = routingKey == "balance";

        if (subscribedMatch || unsubscribedMatch) {
          const channels: string[] = event["streams"];

          this.channels = channels;
        }

        if (balanceUpdateMatch) {
          UserController.add_update_balance(event as ZTypes.Balance);
        }

        if (depthUpdateMatch) {
          const orderbook = TradeController.orderbook;
          const payload: { asks: string[][]; bids: string[][]; sequence: number } = event;

          if (orderbook.sequence >= payload.sequence) return;

          orderbook.sequence = payload.sequence;

          (["asks", "bids"]).forEach((side: ZTypes.TakerType) => {
            if (!payload[side]) return;

            payload[side].forEach((order: string[]) => {
              const order_price = Number(order[0]);
              const order_amount = Number(order[1]);

              if (order_amount > 0) {
                orderbook.add(order_price, order_amount, side);
              } else {
                orderbook.remove(order_price, side);
              }
            })
          })
        }

        if (klineMatch) {
          TradeController.tradingview.add_update_chart({
              time: event[0],
              open: event[1],
              high: event[2],
              low: event[3],
              close: event[4],
              volume: event[5]
            },
            "kline"
          );
        }

        if (tradesMatch) {
          for (const trade of (event.trades as ZTypes.PublicTrade[])) {
            TradeController.add_trade(trade);

            TradeController.tradingview.add_update_chart({
                time: (new Date(trade.created_at).getTime() / 1000).toFixedNumber(0),
                close: Number(trade.price),
                volume: Number(trade.amount)
              },
              "trade"
            );
          }
        }

        switch (routingKey) {
          case "global.tickers": {
            PublicController.tickers = event;
            break;
          } case "order":{
            const order: ZTypes.Order = event;

            if (order.state === "wait") TradeController.open_orders.add(order);
            if (order.state === "done") TradeController.open_orders.delete(order.id);
            if (order.state === "cancel") TradeController.open_orders.delete(order.id);
            TradeController.orders_history.add(order);
            break;
          } case "trade": {
            const trade: ZTypes.Trade = event;

            TradeController.trades_history.add(trade);
            break;
          } case "balance": {
            const balance: ZTypes.Balance = event;

            UserController.add_update_balance(balance);
            break;
          }
        }
      }
    }
  }

  subscribe(channel: string) {
    const payload = JSON.stringify({
      event: "subscribe",
      streams: [channel]
    });

    this.send(payload);
  }

  unsubscribe(channel: string) {
    const payload = JSON.stringify({
      event: "unsubscribe",
      streams: [channel]
    });

    this.send(payload);
  }

  ping() {
    this.send("ping");
  }

  close() {
    if (!this.is_connected) return;
    this.disable_reconnect();
    this.socket.close();
  }

  disable_reconnect() {
    this.allow_reconnect = false;
  }

  send_raw(
    message: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView
  ) {
    this.socket.send(message);
  }

  send(
    message: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView
  ) {
    this.wait_and_callback(message);
  }

  wait_and_callback(
    message: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView
  ) {
    if (this.is_connected) this.send_raw(message);
    else setTimeout(() => this.wait_and_callback(message), 100);
  }
}

export default ZSocket;
