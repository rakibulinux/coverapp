<template>
  <div class="ticker-status">
    <div class="left-panel text-left">
      <p class="price">{{ getLastPrice }}</p>
      <p class="last-change">
        <span>{{ getPriceUSD }}</span>
        <span :class="getLastTrend">{{ getChange }}</span>
      </p>
    </div>
    <div class="right-panel text-right">
      <p class="vol">Vol {{ getVolume }}</p>
      <p class="high">High {{ getHighPrice }}</p>
      <p class="low">Low {{ getLowPrice }}</p>
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";

export default {
  props: {
    market: Array,
    tickerName: Function,
    pricePrecision: Function,
    amountPrecision: Function,
    percentToNumber: Function
  },
  computed: {
    ticker() {
      const name = this.tickerName(this.market);
      const ticker = this.$store.getters["public/getAllTickers"][name];
      return ticker;
    },
    getLastPrice() {
      return helpers.getMarketLastPrice(this.tickerName(this.market));
    },
    getPriceUSD() {
      return helpers.getMarketLastUSD(this.tickerName(this.market));
    },
    getChange() {
      return this.ticker.price_change_percent;
    },
    getVolume() {
      return Number(
        Number(this.ticker.volume).toFixed(this.amountPrecision(this.market))
      ).toLocaleString();
    },
    getHighPrice() {
      return Number(this.ticker.high).toFixed(this.pricePrecision(this.market));
    },
    getLowPrice() {
      return Number(this.ticker.low).toFixed(this.pricePrecision(this.market));
    },
    getLastTrend() {
      const change = this.percentToNumber(this.getChange);
      return helpers.getTrend(change);
    }
  }
};
</script>