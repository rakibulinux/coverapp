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

type Side = "asks" | "bids";

export default class OrderBook {
  asks: Depth
  bids: Depth
  sequence: number;
  callback = new Array<{ uuid: string; func: (side?: Side) => void }>();

  constructor() {
    this.asks = new Depth((a, b) => a.price - b.price);
    this.bids = new Depth((a, b) => b.price - a.price);
    this.sequence = 1;

    this.asks.updated = () => this.updated("asks");
    this.bids.updated = () => this.updated("bids");
  }

  get(key: any, side: Side) {
    return this[side].find(key);
  }

  has_key(key: any, side: Side) {
    return !!this[side].find(key);
  }

  insert(key: any, data: any, side: Side) {
    this[side].add(key, data);
  }

  remove(key: any, side: Side) {
    this[side].delete(key);
  }

  toArray(side :Side, limit?: number) {
    return this[side].toArray(limit);
  }

  clear() {
    this.sequence = 0;
    ["asks", "bids"].forEach((side) => this[(side as Side)].clear());
  }

  add_callback(callback: (side: Side) => void) {
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
