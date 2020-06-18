<template>
  <div class="top-btc-volume">
    <div class="title">
      <div class="text">Top BTC Volume</div>
      <div class="other">
        <i class="ic-arrow-forward" @click="openMarketList" />
      </div>
    </div>
    <div class="ex_table table_noscroll">
      <dt>
        <span class="text-left">Pair</span>
        <span class="text-left">Last Price</span>
        <span class="text-right">Volume(BTC)</span>
      </dt>
      <dd>
        <p
          v-for="(market, index) in findTopBTCVolume"
          :key="index"
          @click="openMarketPreview(market)"
        >
          <span class="text-left pair">
            <span>{{ market.base_unit.toUpperCase() }}</span>
            <span>/ {{ market.quote_unit.toUpperCase() }}</span>
          </span>
          <span
            class="text-left"
            :class="getTrend(market.price_change_percent)"
          >
            {{ getPrice(market.last, market.id) }}
          </span>
          <span class="text-right">
            {{ getAmount(market.volume, market.id) }}
          </span>
        </p>
      </dd>
    </div>
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class TopBTCVolume extends Mixins(MarketMixin) {
  get findTopBTCVolume() {
    let tickers = this.findTickers("market", "btc");

    tickers = tickers
      .sort((low, high) => Number(low["volume"]) - Number(high["volume"]))
      .reverse();
    return tickers.slice(0, 5);
  }

  openMarketList() {
    this.$router.push("/m/markets");
  }

  openMarketPreview(market) {
    ZSmartModel.emit("open-market-preview", {
      methods: "setMarket",
      data: market
    });
  }
}
</script>
