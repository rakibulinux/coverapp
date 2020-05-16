<template>
  <swiper :options="swiperOption" class="feature-markets">
    <swiper-slide>
      <li v-for="(data, index) in featureMarkets('one')" :key="`one` + index" class="market" @click="openMarketPreview(data.split('/'))">
        <p class="name">{{ data.replace("/", " / ") }}</p>
        <p class="last">{{ getLastPrice(data) }}</p>
        <p :class="[getTrend(percentToNumber(getChange(data))), 'rate']">{{ getChange(data) }}</p>
      </li>
    </swiper-slide>
    <swiper-slide>
      <li v-for="(data, index) in featureMarkets('two')" :key="`two` + index" class="market" @click="openMarketPreview(data.split('/'))">
        <p class="name">{{ data.replace("/", " / ") }}</p>
        <p class="last">{{ getLastPrice(data) }}</p>
        <p :class="[getTrend(percentToNumber(getChange(data))), 'rate']">{{ getChange(data) }}</p>
      </li>
      <li>More</li>
    </swiper-slide>
    <div slot="pagination" class="swiper-pagination" />
  </swiper>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import config from "@/config";

export default {
  props: {
    tickerName: Function,
    percentToNumber: Function,
    getTrend: Function,
    getPrice: Function
  },
  data: () => ({
    swiperOption: {
      spaceBetween: 0,
      pagination: {
        el: ".swiper-pagination"
      }
    }
  }),
  methods: {
    openMarketPreview(market) {
      ZSmartModel.emit("open-market-preview", { methods: "setMarket", data: market });
    },
    getSparkline(ticker) {
      return this.$store.getters["public/getAllSparkline"][this.tickerName(ticker)];
    },
    getTicker: ticker => helpers.getTicker(ticker),
    getLastPrice(ticker) {
      return this.getPrice(this.getTicker(ticker).last, ticker);
    },
    getLastPriceUSD(ticker) {
      return helpers.getTickerPriceUSD(ticker, this.getLastPrice(ticker));
    },
    getChange(ticker) {
      return this.getTicker(ticker).price_change_percent;
    },
    MarketJoin(ticker) {
      const marketArray = ticker.split("/");
      const market = marketArray.join("_");
      this.$store.commit("public/SYNC_EXCHANGE", market);
    },
    featureMarkets(type) {
      let valueOne = [];
      let valueTwo = [];
      const { feature_markets } = config;
      for (const i in feature_markets) {
        if (i <= 2) valueOne.push(feature_markets[i]);
        else valueTwo.push(feature_markets[i]);
      }

      if (type === "one") return valueOne;
      return valueTwo;
    }
  }
};
</script>
