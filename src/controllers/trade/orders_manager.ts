import ApiClient from "@zsmartex/z-apiclient";
import Vue from "vue";

export default class OrdersManager {
  updated?(): void;

  // Header
  headers = {
    page: 1,
    limit: 100,
    total: 0,
  };

  // Config
  market = "All";
  state: ZTypes.OrderState | "All" = "All";
  ready = false;
  loading = false;
  realtime = false;
  // Data
  orders = new Array<ZTypes.Order>();

  constructor(market?: string, state?: ZTypes.OrderState | "All") {
    if (market) this.market = market;
    if (state) this.state = state;
  }

  async getData(page = this.headers.page, limit = this.headers.limit) {
    if (!this.ready) this.loading = true;

    try {
      const {
        data,
        headers,
      }: {
        data: ZTypes.Order[];
        headers: any;
      } = await this.getOrders(this.market, this.state, page, limit);

      data.forEach(order => {
        this.add(order, true);
      });
      this.headers.page = Number(headers.page);
      this.headers.total = Number(headers.total);
      this.headers.limit = Number(headers["per-page"]);
      this.loading = false;
      this.ready = true;

      return { data, headers };
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  private getOrders(market?: string, state?: ZTypes.OrderState | "All", page?: number, limit?: number) {
    return new ApiClient("trade").get("market/orders", {
      market: market !== "All" ? market : undefined,
      state: state !== "All" ? state : undefined,
      page,
      limit
    });
  }

  findIndex(id: number) {
    return this.orders.findIndex(order => order.id === id);
  }

  find(id: number) {
    return this.orders.find(order => order.id === id);
  }

  delete(id: number) {
    const index = this.findIndex(id);

    if (index >= 0) {
      this.orders.splice(index, 1);

      if (typeof this.updated === "function") {
        this.updated();
      }
    }
  }

  add(order: ZTypes.Order, force = this.realtime && this.ready) {
    if (!force) return false;
    if (this.orders.length === this.headers.limit && order.id < this.orders[this.orders.length - 1].id) return false;
    if (order.market !== this.market && this.market !== "All") return false;
    if (order.state !== this.state && this.state !== "All") return false;

    if (this.find(order.id)) {
      const index = this.findIndex(order.id);

      if (index >= 0) this.orders[index] = order;
    } else {
      let orders = this.orders;

      orders.push(order);
      orders = orders.sort((a, b) => b.id - a.id);
      orders = orders.slice(0, 100);

      Vue.set(this, "orders", orders);
    }

    if (typeof this.updated === "function") {
      this.updated();
    }

    return true;
  }

  resetHeaders() {
    return this.headers = {
      page: 1,
      limit: 100,
      total: 0,
    };
  }

  clear() {
    this.resetHeaders();

    this.ready = false;
    this.loading = false;
    this.realtime = false;
    this.orders.length = 0;

    if (typeof this.updated === "function") {
      this.updated();
    }
  }
}
