<template>
  <ul class="feature-markets">
    <li
      v-for="(data, index) in feature_markets"
      :key="index"
      class="market"
      @click="MarketJoin(data)"
    >
      <span class="rate" :class="getTrend(getChange(NameToID(data)), true)">
        {{ getChange(NameToID(data)) }}
      </span>
      <h3 class="name">
        <span>{{ reWorkName(data) }}</span>
        <i>{{ data.split("/")[1] }}</i>
      </h3>
      <p class="price">
        <span :class="getTrend(getChange(NameToID(data)), false)">
          {{ getLastPrice(NameToID(data)) }}
        </span>
        <i>≈ ${{ getLastPriceUSD(NameToID(data)) }}</i>
      </p>
      <p class="vol">
        <span>{{ $t("table.24h_volume") }}</span>
        <i>{{ getVolume(NameToID(data)) }} {{ data.split("/")[1] }}</i>
      </p>
      <sparkline :market_id="NameToID(data)" />
    </li>
  </ul>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import config from "@/config";
import sparkline from "@/components/desktop/home/sparkline";

export default {
  components: {
    sparkline
  },
  computed: {
    feature_markets: () => config.feature_markets,
    pricePrecision: () => helpers.pricePrecision(),
    totalPrecision: () => helpers.totalPrecision()
  },
  methods: {
    getPrice(value) {
      const { pricePrecision } = this;

      return Number(value).toFixed(pricePrecision);
    },
    reWorkName(name) {
      const nameArray = name.split("/");
      return nameArray.join(" / ").toUpperCase();
    },
    NameToID(name) {
      const nameArray = name.split("/");
      return nameArray.join("").toLowerCase();
    },
    getTicker: ticker => helpers.getTicker(ticker),
    getLastPrice(ticker) {
      return this.getPrice(this.getTicker(ticker).last);
    },
    getLastPriceUSD(ticker) {
      return helpers.getTickerPriceUSD(ticker, this.getLastPrice(ticker));
    },
    getVolume(ticker) {
      const { totalPrecision } = this;

      return Number(
        Number(this.getTicker(ticker).volume).toFixed(totalPrecision)
      ).toLocaleString();
    },
    getTrend(price_change_percent, bg = false) {
      const chance = helpers.percentToNumber(price_change_percent);
      return helpers.getTrend(chance, bg);
    },
    getChange(ticker) {
      return this.getTicker(ticker).price_change_percent;
    },
    MarketJoin(ticker) {
      const marketArray = ticker.split("/");
      const market = marketArray.join("_");
      this.$store.commit("public/SYNC_EXCHANGE", { market });
    }
  }
};
</script>
