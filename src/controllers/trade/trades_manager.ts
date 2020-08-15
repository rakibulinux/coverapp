import ApiClient from "@zsmartex/z-apiclient";
import Vue from "vue";

export default class TradesManager {
  updated?(): void;
  // Header
  headers = {
    page: 1,
    limit: 100,
    total: 0,
  };

  // Config
  market = "All";
  ready = false;
  loading = false;
  realtime = false;
  // Data
  trades = new Array<ZTypes.Trade>();

  constructor(market?: string) {
    if (market) this.market = market;
  }

  async getData(page = this.headers.page, limit = this.headers.limit) {
    if (!this.ready) this.loading = true;

    try {
      const {
        data,
        headers,
      }: {
        data: ZTypes.Trade[];
        headers: any;
      } = await this.getTrades(this.market, page, limit);

      data.forEach(trade => {
        this.add(trade, true);
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

  private getTrades(market?: string, page?: number, limit?: number) {
    return new ApiClient("trade").get("market/trades", {
      market: market !== "All" ? market : undefined,
      page,
      limit
    });
  }

  findIndex(id: number) {
    return this.trades.findIndex(trade => trade.id === id);
  }

  find(id: number) {
    return this.trades.find(trade => trade.id === id);
  }

  delete(id: number) {
    const index = this.findIndex(id);

    if (index >= 0) {
      this.trades.splice(index, 1);

      if (typeof this.updated === "function") {
        this.updated();
      }
    }
  }

  add(trade: ZTypes.Trade, force = this.realtime && this.ready) {
    if (!force) return false;
    if (this.trades.length === this.headers.limit && trade.id < this.trades[this.trades.length - 1].id) return false;
    if (trade.market !== this.market && this.market !== "All") return false;

    if (this.find(trade.id)) {
      const index = this.findIndex(trade.id);

      if (index >= 0) this.trades[index] = trade;
    } else {
      let trades = this.trades;

      trades.push(trade);
      trades = trades.sort((a, b) => b.id - a.id);
      trades = trades.slice(0, 100);

      Vue.set(this, "trades", trades);
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
    this.trades.length = 0;

    if (typeof this.updated === "function") {
      this.updated();
    }
  }
}
