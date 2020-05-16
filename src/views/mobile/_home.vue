<template>
  <z-content class="page-home-m pull-content">
    <pull-to :last-update="lastUpdate" :top-load-method="refresh">
      <preview />
      <feature-markets
        :ticker-name="tickerName"
        :percent-to-number="percentToNumber"
        :get-trend="getTrend"
        :get-price="getPrice"
      />
      <top-btc-volume
        :find-tickers="findTickers"
        :percent-to-number="percentToNumber"
        :get-trend="getTrend"
        :get-price="getPrice"
        :get-amount="getAmount"
      />
      <trend-top
        :find-tickers="findTickers"
        :percent-to-number="percentToNumber"
        :get-trend="getTrend"
        :get-price="getPrice"
      />
      <more-markets />
    </pull-to>
    <search-markets ref="search-markets" />
    <market-preview ref="market-preview" />
  </z-content>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";
import PullTo from "@/components/mobile/pull-to";
import _preview from "@/layouts/mobile/home/_preview.vue";
import _feature_markets from "@/layouts/mobile/home/_feature_markets.vue";
import _top_btc_volume from "@/layouts/mobile/home/_top_btc_volume.vue";
import _trend_top from "@/layouts/mobile/home/_trend_top.vue";
import _more_markets from "@/layouts/mobile/home/_more_markets.vue";
import _search_markets from "@/views/mobile/screens/search-markets";
import _market_preview from "@/views/mobile/screens/market-preview";
import Helpers from "./helpers";
import { mapState } from "vuex";
import { setTimeout } from "timers";

export default {
  components: {
    "pull-to": PullTo,
    preview: _preview,
    "feature-markets": _feature_markets,
    "top-btc-volume": _top_btc_volume,
    "trend-top": _trend_top,
    "more-markets": _more_markets,
    "search-markets": _search_markets,
    "market-preview": _market_preview
  },
  mixins: [Helpers],
  data: () => ({}),
  computed: {
    ...mapState("public", ["lastUpdate"])
  },
  mounted() {
    ZSmartModel.on("open-market-preview", args => {
      this.removeSearchMarket();
      this.openMarketPreview(args);
    });
  },
  beforeDestroy() {
    ZSmartModel.remove("open-market-preview");
    ZSmartModel.remove("open-search-markets");
  },
  methods: {
    async refresh(loaded) {
      try {
        await this.$store.dispatch("public/getTimeStamp");
        await this.$store.dispatch("public/getGlobalPrice");
        await this.$store.dispatch("public/getCurrencies");
        await this.$store.dispatch("public/getMarkets");
        await this.$store.dispatch("public/getSparkLines");
        await this.$store.dispatch("public/getTickers");
        loaded("done");
      } catch (error) {
        loaded("failed");
        return error;
      }
    },
    removeSearchMarket() {
      this.$refs["search-markets"].remove();
    },
    removeMarketPreview() {
      this.$refs["market-preview"].remove();
    },
    openSearchMarket() {
      this.$refs["search-markets"].render();
    },
    openMarketPreview(args) {
      this.$refs["market-preview"].render(args);
    }
  }
};
</script>

<style>
.child {
  height: 500px;
}
</style>
