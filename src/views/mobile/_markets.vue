<template>
  <z-content class="page-market-m">
    <head-bar
      :selected="selected"
      :check-favorite="checkFavorite"
      :add-or-remove-favorite="addOrRemoveFavorite"
      @change="changeSelect"
      @on-open-screen="openSearchMarket()"
    />
    <market-list
      :find-tickers="findTickers"
      :check-favorite="checkFavorite"
      :percent-to-number="percentToNumber"
      :selected="selected"
      :get-trend="getTrend"
      :get-price="getPrice"
      :get-amount="getAmount"
      @on-open-screen="openMarketPreview"
    />
    <search-markets ref="search-markets" />
    <market-preview ref="market-preview" />
  </z-content>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";
import config from "@/config";
import _head_bar from "@/layouts/mobile/markets/_head_bar";
import _market_list from "@/layouts/mobile/markets/_market_list";
import _search_markets from "@/views/mobile/screens/search-markets";
import _market_preview from "@/views/mobile/screens/market-preview";
import Helpers from "./helpers";

export default {
  components: {
    "head-bar": _head_bar,
    "market-list": _market_list,
    "search-markets": _search_markets,
    "market-preview": _market_preview
  },
  mixins: [Helpers],
  data: () => ({
    selected: "",
    search: ""
  }),
  mounted() {
    this.selected = config.list_bid1[0];
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
    changeSelect(symbol) {
      this.selected = symbol;
    },
    removeSearchMarket() {
      this.$refs["search-markets"].remove();
    },
    removeMarketPreview(args) {
      this.$refs["market-preview"].remove();
    },
    openSearchMarket() {
      this.$refs["search-markets"].render();
    },
    openMarketPreview(args) {
      this.$refs["market-preview"].create(args);
    }
  }
};
</script>
