import ApiClient from "@zsmartex/z-apiclient";
import Vue from "vue";
import TradeController from "@/controllers/trade";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export default class OrdersManager {
  state: ZTypes.OrderState | "All" = "All";
  type : "open_orders" | "orders_history";

  headers = reactive({
    page: 1,
    limit: 100,
    total: 0,
  })

  config = reactive({
    market: "All",
    ready: false,
    loading: false,
    realtime: true,
  })

  constructor(type: OrdersManager["type"], state?: ZTypes.OrderState | "All") {
    this.type = type;
    if (state) this.state = state;
  }

  get orders() {
    return TradeController.store[this.type];
  }

  set orders(val) {
    TradeController.store[this.type] = val;
  }

  get market() {
    return this.config.market;
  }

  set market(market: string) {
    this.config.market = market;
  }

  get ready() {
    return this.config.ready;
  }

  set ready(ready: boolean) {
    this.config.ready = ready;
  }

  get loading() {
    return this.config.loading;
  }

  set loading(loading: boolean) {
    this.config.loading = loading;
  }

  get realtime() {
    return this.config.realtime;
  }

  set realtime(realtime: boolean) {
    this.config.realtime = realtime;
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
      this.ready = true;

      return { data, headers };
    } catch (error) {
      return error;
    } finally {
      Vue.set(this, "loading", false);
    }
  }

  private getOrders(market?: string, state?: ZTypes.OrderState | "All", page?: number, limit?: number) {
    return TradeController.get_orders({
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
      Vue.delete(this.orders, index);
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
      this.orders.push(order);
      this.orders = this.orders.sort((a, b) => b.id - a.id);
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

  toArray() {
    return this.orders;
  }

  clear() {
    this.resetHeaders();

    this.ready = false;
    this.loading = false;
    this.realtime = false;
    this.orders = [];
  }
}
