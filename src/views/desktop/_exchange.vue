<template>
  <z-content :key="identifier" class="page-exchange">
    <div class="group-left">
      <market-list />
    </div>
    <div class="group-middle">
      <ticker-status />
      <main-chart />
      <mine-control />
    </div>
    <div class="group-right">
      <div id="global_list">
        <order-book />
        <market-trades />
      </div>
      <trade-action />
    </div>
  </z-content>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import config from "@/config";
import _ticker from "@/layouts/desktop/exchange/_ticker.vue";
import _main_chart from "@/layouts/desktop/exchange/_main_chart.vue";
import _mine_control from "@/layouts/desktop/exchange/_mine_control.vue";
import _order_book from "@/layouts/desktop/exchange/_order_book.vue";
import _market_trades from "@/layouts/desktop/exchange/_market_trades.vue";

const RESOLUTION_STREAM = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "30": "30m",
  "60": "1h",
  "1D": "1d",
  "1W": "1w"
};

export default {
  name: "Exchange",
  components: {
    "market-list": () => import("@/layouts/desktop/exchange/market-list"),
    "ticker-status": _ticker,
    "main-chart": _main_chart,
    "mine-control": _mine_control,
    "order-book": _order_book,
    "market-trades": _market_trades,
    "trade-action": () => import("@/layouts/desktop/exchange/trade-action")
  },
  data: () => ({
    identifier: 0
  }),
  beforeCreate() {
    this.$store.dispatch("exchange/getMarketTrades");
  },
  mounted() {
    this.onLoad();
    ZSmartModel.on("exchange-render", this.forceRerender);
  },
  destroyed() {
    this.removeLoad(helpers.isMarket());
  },
  methods: {
    forceRerender(new_market, old_market) {
      this.$nextTick(async () => {
        this.identifier += 1;
        await this.removeLoad(old_market);
        await this.LoadData();
        await this.onLoad();
      });
    },
    LoadData() {
      this.$store.dispatch("exchange/getMarketTrades");
    },
    removeLoad(market) {
      const tradingview_resolution = localStorage.getItem(
        "tradingview.resolution"
      );

      [
        "depth",
        "trades",
        "kline-" + RESOLUTION_STREAM[tradingview_resolution]
      ].forEach(channel => {
        this.$store.dispatch("websocket/unsubscribe", market + "." + channel);
      });
    },
    onLoad() {
      const market = helpers.isMarket();
      const tradingview_resolution =
        localStorage.getItem("tradingview.resolution") || "15";

      this.setTitle();

      [
        "depth",
        "trades",
        "kline-" + RESOLUTION_STREAM[tradingview_resolution]
      ].forEach(channel => {
        this.$store.dispatch("websocket/subscribe", market + "." + channel);
      });
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

<style lang="less">
@import "~@/assets/css/views/desktop/exchange";
</style>