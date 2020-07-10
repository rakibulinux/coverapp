<template>
  <div class="ticker-status">
    <div class="left-panel text-left">
      <p class="price">{{ getLastPrice }}</p>
      <p class="last-change">
        <span>{{ getPriceUSD }}</span>
        <span :class="getLastTrend">{{ ticker.price_change_percent }}</span>
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
import * as helpers from "@zsmartex/z-helpers";
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component
export default class Depth extends Mixins(MarketMixin) {
  @Prop() readonly market!: ZTypes.Market;

  get ticker() {
    const ticker = store.state.public.tickers[this.market.id];
    return ticker;
  }

  get getLastPrice() {
    return helpers.getMarketLastPrice(this.market.id);
  }

  get getPriceUSD() {
    return helpers.getMarketLastUSD(this.market.id);
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
    const change = parseInt(this.ticker.price_change_percent);
    return helpers.getTrend(change);
  }
}
</script>
