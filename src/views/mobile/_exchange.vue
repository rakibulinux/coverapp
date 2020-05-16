<template>
  <z-content class="page-exchange-m">
    <head-bar :title="market.join(' / ')" :left-disabled="true">
      <template v-slot:right>
        <div class="right-action">
          <i
            v-if="checkFavorite(market.join('/'))"
            class="ic-star"
            @click="addOrRemoveFavorite(market.join('/'))"
          />
          <i
            v-else
            class="ic-no-star"
            @click="addOrRemoveFavorite(market.join('/'))"
          />
        </div>
      </template>
    </head-bar>
    <div class="body-bar">
      <div class="group-top">
        <order-entry class="group-top-left" />
        <order-book class="group-top-right" />
      </div>
      <mine-control class="group-bottom" />
    </div>
  </z-content>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import config from "@/config";
import _order_book from "@/layouts/mobile/exchange/_order_book";
import _order_entry from "@/layouts/mobile/exchange/_order_entry";
import _mine_control from "@/layouts/mobile/exchange/mine-control";
import Helpers from "./helpers";

export default {
  components: {
    "order-book": _order_book,
    "order-entry": _order_entry,
    "mine-control": _mine_control
  },
  mixins: [Helpers],
  data: () => ({
    selected: "Buy"
  }),
  computed: {
    market() {
      const { market } = this.$store.state.public;
      return market.toUpperCase().split("_");
    },
    getTypePage() {
      const { type } = this.$router.history.current.query;
      return !type ? "buy" : type.toLowerCase();
    }
  },
  beforeDestroy() {
    this.removeLoad();
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    trigger(value) {
      this.selected = value;
      this.$router.push("/m/exchange?type=" + value);
    },
    LoadData(market) {
      this.$store.dispatch("exchange/getMarketDepth");
    },
    removeLoad() {
      const channel = this.tickerName(this.market);
      this.$store.dispatch("websocket/unsubscribe", channel);
    },
    onLoad() {
      this.setTitle();
      this.LoadData();
      const channel = this.tickerName(this.market);
      this.$store.dispatch("websocket/subscribe", channel);
    },
    setTitle() {
      document.title = `${helpers.getMarketLastPrice()} - ${(
        helpers.isAskSymbol() +
        "/" +
        helpers.isBidSymbol()
      ).toUpperCase()} - ${config.nameEX}`;
    }
  }
};
</script>
