import store from "@/store";
import * as helpers from "@zsmartex/z-helpers";
import { Component, Vue } from "vue-property-decorator";

@Component
export class MarketMixin extends Vue {
  market!: ZTypes.Market;

  get ticker() {
    const tickers = Object.values(store.state.public.tickers);
    return tickers.find((ticker) => ticker.id === this.market.id);
  }

  pricePrecision(market = this.market.id) {
    return helpers.pricePrecision(market);
  }

  amountPrecision(market = this.market.id) {
    return helpers.amountPrecision(market);
  }

  totalPrecision(market = this.market.id) {
    return helpers.totalPrecision(market);
  }

  findTickers(type, data) {
    const { findTickersBase } = helpers;
    let tickers = Object.values(store.state.public.tickers);

    tickers = findTickersBase(tickers, type, data);

    return tickers;
  }

  getPrice(price: string | number, market?: string) {
    return Number(price).toFixed(this.pricePrecision(market));
  }

  getAmount(amount: string | number, market?: string) {
    return Number(amount).toFixed(this.amountPrecision(market));
  }

  getTotal(amount: string | number, market?: string) {
    return Number(amount).toFixed(this.totalPrecision(market));
  }

  checkFavorite(market: string) {
    return helpers.checkFavorite(market);
  }

  addOrRemoveFavorite(market: string) {
    helpers.addOrRemoveFavorite(market);
  }

  percentToNumber(value: string) {
    return Number(value.replace("%", ""));
  }

  getTrend(value: string | number, bg = false) {
    if (typeof value === "string") {
      if (value.includes("%")) value = parseFloat(value.toString());
    }

    return helpers.getTrend(value, bg);
  }

  getDate(date: Date, year = false) {
    return helpers.getDate(date, year);
  }

  getTime(time: Date) {
    return helpers.getTime(time);
  }
}
