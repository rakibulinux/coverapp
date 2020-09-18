import TradeController from "@/controllers/trade";
import uuid from "uuid/v4";
import Vue from "vue";

export class Depth {
  updated?(): void;

  calc: (a: { price: number; amount: number }, b: { price: number; amount: number }) => number
  orders = Array<{ price: number; amount: number }>();

  constructor(calc: Depth["calc"]) {
    this.calc = calc;
  }

  find(price: number) {
    return this.orders.find(order => order[0] === price);
  }

  findIndex(price: number) {
    return this.orders.findIndex(order => order.price === price);
  }

  delete(price: number) {
    const index = this.findIndex(price);

    if (index >= 0) {
      Vue.delete(this.orders, index);
      if (typeof this.updated === "function") {
        this.updated();
      }
    }
  }

  add(price: number, amount: number) {
    const index = this.findIndex(price);

    if (index >= 0) {
      Vue.set(this.orders, index, { price, amount });
    } else {
      Vue.set(this.orders, this.orders.length, { price, amount });
      this.orders.sort(this.calc);
    }
    if (typeof this.updated === "function") {
      this.updated();
    }
  }

  toArray(limit = 500) {
    return this.orders.slice(0, limit);
  }

  clear() {
    this.orders.length = 0;
    if (typeof this.updated === "function") {
      this.updated();
    }
  }
}

export default class OrderBook {
  asks: Depth
  bids: Depth
  sequence: number;
  callback = new Array<{ uuid: string; func: (side?: ZTypes.TakerType) => void }>();

  constructor() {
    this.asks = new Depth((a, b) => a.price - b.price);
    this.bids = new Depth((a, b) => b.price - a.price);
    this.sequence = 1;

    this.asks.updated = () => this.updated("asks");
    this.bids.updated = () => this.updated("bids");
  }

  async fetch(market_id: string, limit?: number) {
    try {
      const { data } = await TradeController.get_depth(market_id, limit);
      const depth: { [key in ZTypes.TakerType]: string[][] } = data;
      this.clear();

      ["asks", "bids"].forEach((side: ZTypes.TakerType) => {
        depth[side].forEach(row => {
          const price = Number(row[0]);
          const amount = Number(row[1]);

          this.insert(price, amount, side);
        })
      })
    } catch (error) {
      return error;
    }
  }

  get(key: any, side: ZTypes.TakerType) {
    return this[side].find(key);
  }

  has_key(key: any, side: ZTypes.TakerType) {
    return !!this[side].find(key);
  }

  insert(key: any, data: any, side: ZTypes.TakerType) {
    this[side].add(key, data);
  }

  remove(key: any, side: ZTypes.TakerType) {
    this[side].delete(key);
  }

  toArray(side: ZTypes.TakerType, limit?: number) {
    return this[side].toArray(limit);
  }

  clear() {
    this.sequence = 0;
    ["asks", "bids"].forEach((side) => this[(side as ZTypes.TakerType)].clear());
  }

  add_callback(callback: (side: ZTypes.TakerType) => void) {
    const uuid_callback = uuid();

    this.callback.push({ uuid: uuid_callback, func: callback });

    return uuid_callback;
  }

  remove_callback(uuid: string) {
    const index = this.callback.findIndex(callback => callback.uuid === uuid);

    if (index >= 0) {
      this.callback.splice(index, 1);
    }
  }

  updated(side) {
    this.callback.forEach((callback) => {
      callback.func(side);
    });
  }
}
