<template>
  <li class="market" @click="$emit('click')">
    <p class="name">{{ market.name.replace("/", " / ") }}</p>
    <p class="last">{{ last }}</p>
    <p :class="['rate', getTrend(price_change_percent)]">
      {{ price_change_percent }}
    </p>
  </li>
</template>

<script lang="ts">
import * as helpers from "@zsmartex/z-helpers";
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins, Prop } from "vue-property-decorator";

@Component
export default class FeatureMarket extends Mixins(MarketMixin) {
  @Prop() readonly market!: ZTypes.Market;

  get ticker() {
    return helpers.getTicker(this.market.id);
  }

  get last() {
    const ticker = this.ticker;

    return this.getPrice(ticker.last);
  }

  get price_change_percent() {
    const ticker = this.ticker;

    return ticker.price_change_percent;
  }
}
</script>
