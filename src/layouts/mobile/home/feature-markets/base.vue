<template>
  <swiper :options="swiperOption" class="feature-markets">
    <swiper-slide>
      <feature-market
        v-for="(market_name, index) in featureMarkets('one')"
        :key="`one` + index"
        :market="getMarketByName(market_name)"
      />
    </swiper-slide>
    <swiper-slide>
      <feature-market
        v-for="(market_name, index) in featureMarkets('two')"
        :key="`one` + index"
        :market="getMarketByName(market_name)"
      />
      <li>More</li>
    </swiper-slide>
    <div slot="pagination" class="swiper-pagination" />
  </swiper>
</template>

<script lang="ts">
import store from "@/store";
import { Vue, Component } from "vue-property-decorator";
import config from "@/config";

@Component({
  components: {
    "feature-market": () => import("./feature-market.vue")
  }
})
export default class FeatureMarkets extends Vue {
  swiperOption = {
    spaceBetween: 0,
    pagination: {
      el: ".swiper-pagination"
    }
  };

  getMarketByName(market_name: string) {
    if (!market_name.includes("/")) return;

    const market_id = market_name
      .split("/")
      .join("")
      .toLowerCase();

    return store.state.public.markets.find(market => market.id == market_id);
  }

  featureMarkets(type) {
    const valueOne = [];
    const valueTwo = [];
    const { feature_markets } = config;
    for (const i in feature_markets) {
      if (Number(i) <= 2) valueOne.push(feature_markets[i]);
      else valueTwo.push(feature_markets[i]);
    }

    return type === "one" ? valueOne : valueTwo;
  }
}
</script>
