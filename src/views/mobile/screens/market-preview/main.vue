<template>
  <transition name="panel-move">
    <panel-view v-if="isShowing" class="market-preview">
      <head-bar :title="market.join(' / ')" @on-remove="remove()">
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
        <ticker-status
          :market="market"
          :ticker-name="tickerName"
          :price-precision="pricePrecision"
          :amount-precision="amountPrecision"
          :percent-to-number="percentToNumber"
        />
        <group-chart
          :market="market"
          :ticker-name="tickerName"
          :price-precision="pricePrecision"
          :amount-precision="amountPrecision"
          :get-trend="getTrend"
          :get-date="getDate"
        />
        <group-trade
          :market="market"
          :get-price="getPrice"
          :get-amount="getAmount"
          :get-time="getTime"
        />
      </div>
      <tab-bar :market="market" />
    </panel-view>
  </transition>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import config from "@/config";
import ticker_status from "./modules/ticker-status";
import group_chart from "./modules/group-chart";
import group_trade from "./modules/group-trade";
import tab_bar from "./modules/tab-bar";
import methods from "../methods";
import Helpers from "@/views/mobile/helpers";

export default {
  components: {
    "tab-bar": tab_bar,
    "ticker-status": ticker_status,
    "group-chart": group_chart,
    "group-trade": group_trade
  },
  mixins: [methods, Helpers],
  data: () => ({
    widget: null,
    market: []
  }),
  methods: {
    LoadData(market) {
      this.$store.dispatch("exchange/getMarketDepth", this.tickerName(market));
      this.$store.dispatch("exchange/getMarketTrades", this.tickerName(market));
    },
    setMarket(market) {
      this.market = market;
      this.LoadData(market);
    },
    removeLoad() {
      const channel = this.tickerName(this.market);
      this.$store.dispatch("websocket/unsubscribe", channel);
    },
    onLoad() {
      this.setTitle();
      const channel = this.tickerName(this.market);
      this.$store.dispatch("websocket/subscribe", channel);
    },
    onRemove() {
      this.market = [];
      this.removeLoad();
    },
    onRender(args) {
      if (args) {
        this[args.methods](args.data); // this.setMarket(args);
        this.onLoad();
      }
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
