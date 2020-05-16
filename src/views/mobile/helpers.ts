import * as helpers from "@zsmartex/z-helpers";
import componentsInclude from "./components-include";

export default {
  mixins: [componentsInclude],
  methods: {
    tickerName(market) {
      if (typeof market === "object") market = market.join("");
      if (market.includes("/")) market = market.replace("/", "");
      return market.toLowerCase();
    },
    pricePrecision(market = null) {
      return helpers.pricePrecision(
        this.tickerName(market) || this.market.join("")
      );
    },
    amountPrecision(market = null) {
      return helpers.amountPrecision(
        this.tickerName(market) || this.market.join("")
      );
    },
    findTickers(type, data) {
      const { findTickersBase } = helpers;
      let tickers = this.$store.state.public.tickers;
      tickers = Object.values(tickers);
      if (type === "market") {
        tickers = findTickersBase(tickers, type, data);
      }
      if (type === "search") {
        tickers = findTickersBase(tickers, type, data);
      }

      return tickers;
    },
    getPrice(price, market = null) {
      return Number(price).toFixed(this.pricePrecision(market || this.market));
    },
    getAmount(amount, market = null) {
      return Number(amount).toFixed(
        this.amountPrecision(market || this.market)
      );
    },
    checkFavorite: ticker => helpers.checkFavorite(ticker),
    addOrRemoveFavorite: ticker => helpers.addOrRemoveFavorite(ticker),
    percentToNumber: value => Number(value.replace("%", "")),
    getTrend: (value, bg = false) => helpers.getTrend(value, bg),
    getDate: (date, year = false) => helpers.getDate(date, year),
    getTime: time => helpers.getTime(time)
  }
};
