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
        <span>{{ $t("page.global.table.24h_volume") }}</span>
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
import { PublicController, TradeController } from '@/controllers';

export default {
  components: {
    sparkline
  },
  computed: {
    feature_markets: () => config.feature_markets
  },
  methods: {
    getPrice(value, market_id) {
      return Number(value).toFixed(helpers.pricePrecision(market_id));
    },
    reWorkName(name) {
      const nameArray = name.split("/");
      return nameArray.join(" / ").toUpperCase();
    },
    NameToID(name) {
      const nameArray = name.split("/");
      return nameArray.join("").toLowerCase();
    },
    getTicker(market_id) {
      return PublicController.tickers[market_id];
    },
    getLastPrice(market_id) {
      return this.getPrice(this.getTicker(market_id).last, market_id);
    },
    getLastPriceUSD(ticker) {
      return helpers.getTickerPriceUSD(ticker, this.getLastPrice(ticker));
    },
    getVolume(ticker) {
      return Number(
        Number(this.getTicker(ticker).volume).toFixed(helpers.totalPrecision(ticker))
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
      const market_id = marketArray.join("").toLowerCase();

      TradeController.open_exchange(market_id);
    }
  }
};
</script>
