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

<script lang="ts">
import store from "@/store";
import { Vue, Component, Prop } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";

@Component
export default class MarketPreviewTickerStatus extends Vue {
  @Prop() readonly market!: ZTypes.Market;
  @Prop() readonly getPrice!: (
    price: string | number,
    market?: string
  ) => string;
  @Prop() readonly getAmount!: (
    price: string | number,
    market?: string
  ) => string;
  @Prop() readonly percentToNumber!: (value?: string) => number;

  get ticker() {
    const ticker = store.getters["public/getAllTickers"][this.market.id];
    return ticker;
  }

  get getLastPrice() {
    return helpers.getMarketLastPrice(this.market.id);
  }

  get getPriceUSD() {
    return helpers.getMarketLastUSD(this.market.id);
  }

  get getChange() {
    return this.ticker.price_change_percent;
  }

  get getVolume() {
    return Number(this.getAmount(this.ticker.volume)).toLocaleString();
  }

  get getHighPrice() {
    return this.getPrice(this.ticker.high);
  }

  get getLowPrice() {
    return this.getPrice(this.ticker.low);
  }

  get getLastTrend() {
    const change = this.percentToNumber(this.getChange);
    return helpers.getTrend(change);
  }
}
</script>
