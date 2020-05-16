<template>
  <div class="top-btc-volume">
    <div class="title">
      <div class="text">Top BTC Volume</div>
      <div class="other">
        <i class="ic-arrow-forward" @click="openMarketList()" />
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
          v-for="(data, index) in findTopBTCVolume"
          :key="index"
          @click="openMarketPreview(data.name.split('/'))"
        >
          <span class="text-left pair">
            <span>{{ data.base_unit.toUpperCase() }}</span>
            <span>/ {{ data.quote_unit.toUpperCase() }}</span>
          </span>
          <span
            class="text-left"
            :class="getTrend(percentToNumber(data.price_change_percent))"
          >{{ getPrice(data.last, data.name) }}</span>
          <span class="text-right">{{ getAmount(data.volume, data.name) }}</span>
        </p>
      </dd>
    </div>
  </div>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";

export default {
  props: {
    findTickers: Function,
    percentToNumber: Function,
    getTrend: Function,
    getPrice: Function,
    getAmount: Function
  },
  computed: {
    findTopBTCVolume() {
      let tickers = this.findTickers("market", "btc");

      tickers = tickers
        .sort((low, high) => Number(low["volume"]) - Number(high["volume"]))
        .reverse();
      return tickers.slice(0, 5);
    }
  },
  methods: {
    openMarketList() {
      this.$router.push("/m/markets");
    },
    openMarketPreview(market) {
      ZSmartModel.emit("open-market-preview", { methods: "setMarket", data: market });
    }
  }
};
</script>