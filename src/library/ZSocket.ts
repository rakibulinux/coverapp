import TradeController from "@/controllers/trade";
import ZSmartModel from "@zsmartex/z-eventbus";
import { Store } from "vuex";

class ZSocket {
  [key: string]: any;

  url: string;
  type: string;
  callback?: Function;
  socket!: WebSocket;
  store: Store<RootState>;

  is_connected = false;
  allow_reconnect = true;
  channels: string[] = [];

  constructor(url: string, store: Store<RootState>, callback?: Function, type = "public") {
    this.url = url;
    this.type = type;
    this.callback = callback;
    this.store = store;
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

        if (subscribedMatch || unsubscribedMatch) {
          const channels: string[] = event["streams"];

          this.channels = channels;
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

              if (order_amount) {
                orderbook.insert(order_price, order_amount, side);
              } else {
                orderbook.remove(order_price, side);
              }
            })
          })
        }

        if (klineMatch) {
          const resolution = parseInt(String(routingKey).split("kline-")[1]);

          if (resolution !== Number(localStorage.getItem("tradingview.resolution"))) return;

          this.store.dispatch("exchange/dataFeed", { type: "kline", kline: event });
          ZSmartModel.emit("new-kline", event);
        }

        if (tradesMatch) {
          this.store.commit("exchange/ADD_TRADE", event);
          this.store.dispatch("exchange/dataFeed", { type: "trades", trades: event.trades });
          ZSmartModel.emit("new-trade", event);
        }

        switch (routingKey) {
          case "global.tickers": {
            this.store.commit("public/TICKERS", event);
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
            this.store.commit("user/UPDATE_BALANCE", event);
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
