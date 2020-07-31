<template>
  <z-content :key="identifier" class="page-exchange">
    <div class="group-left">
      <market-list />
    </div>
    <div class="group-middle">
      <ticker-status />
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

  mounted() {
    this.onLoad();
    ZSmartModel.on("exchange-render", this.forceRerender);
  }

  beforeDestroy() {
    this.removeLoad(helpers.isMarket());
  }

  forceRerender(new_market, old_market) {
    this.$nextTick(async () => {
      this.identifier += 1;
      this.removeLoad(old_market);
      this.onLoad();
    });
  }

  removeLoad(market) {
    const channels = MarketChannels(market);

    channels.forEach(channel => {
      store.commit("websocket/unsubscribe", channel);
    });
  }

  onLoad() {
    this.setTitle();
    store.state.exchange.depth.clear();

    MarketChannels().forEach(channel => {
      store.commit("websocket/subscribe", channel);
    });
  }

  setTitle() {
    document.title = `${helpers.getMarketLastPrice()} - ${(
      helpers.isAskSymbol() +
      "/" +
      helpers.isBidSymbol()
    ).toUpperCase()} - ${config.nameEX}`;
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/desktop/exchange";
</style>
