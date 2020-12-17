<template>
  <z-content :key="identifier" class="page-exchange">
    <div class="group-left" :class="{ 'hide': hide_pairs_table }">
      <market-list />
    </div>
    <div class="group-middle">
      <ticker-status :hide_pairs_table="hide_pairs_table" @update-hide="(val) => hide_pairs_table = val" />
      <chart />
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

<script lang="ts">
import { TradeController, WebSocketController } from "@/controllers";
import { Vue, Component } from "vue-property-decorator";
import { MarketChannels } from "@/mixins";
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import store from "@/store";
import config from "@/config";

@Component({
  components: {
    "market-list": () => import("@/layouts/desktop/exchange/market-list"),
    "ticker-status": () => import("@/layouts/desktop/exchange/_ticker.vue"),
    chart: () => import("@/layouts/desktop/exchange/chart"),
    "mine-control": () =>
      import("@/layouts/desktop/exchange/_mine_control.vue"),
    "order-book": () => import("@/layouts/desktop/exchange/orderbook"),
    "market-trades": () =>
      import("@/layouts/desktop/exchange/_market_trades.vue"),
    "trade-action": () => import("@/layouts/desktop/exchange/trade-action")
  }
})
export default class Exchange extends Vue {
  identifier = 0;
  hide_pairs_table = false;

  mounted() {
    this.onLoad(TradeController.market.id);
    ZSmartModel.on("exchange-render", this.forceRerender);
    if (window.innerWidth < 1600) {
      this.hide_pairs_table = true;
    }
  }

  beforeDestroy() {
    this.removeLoad(TradeController.market.id);
  }

  forceRerender(new_market, old_market) {
    this.$nextTick(async () => {
      this.identifier += 1;
      this.removeLoad(old_market);
      this.onLoad(new_market);
    });
  }

  removeLoad(market) {
    TradeController.orderbook.clear();
    const channels = MarketChannels(market);

    channels.forEach(channel => {
      WebSocketController.unsubscribe("public", channel);
    });
  }

  onLoad(market: string) {
    this.setTitle();
    TradeController.orderbook.clear();
    TradeController.orderbook.fetch(market, 500);

    MarketChannels().forEach(channel => {
      WebSocketController.subscribe("public", channel);
    });
  }

  setTitle() {
    document.title = `${helpers.getMarketLastPrice()} - ${(
      TradeController.market.name
    ).toUpperCase()} - ${config.nameEX}`;
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/desktop/exchange";
</style>
