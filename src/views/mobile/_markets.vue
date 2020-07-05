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

    <panel-view />
  </z-content>
</template>

<script>
import config from "@/config";
import _head_bar from "@/layouts/mobile/markets/_head_bar";
import _market_list from "@/layouts/mobile/markets/_market_list";
import Helpers from "./helpers";

export default {
  components: {
    "head-bar": _head_bar,
    "market-list": _market_list,
    "panel-view": () => import("@/components/mobile/panel-view.vue")
  },
  mixins: [Helpers],
  data: () => ({
    selected: "",
    search: ""
  }),
  mounted() {
    this.selected = config.list_bid1[0];
  },
  methods: {
    changeSelect(symbol) {
      this.selected = symbol;
    }
  }
};
</script>
