<template>
  <panel-view class="market-preview">
    <head-bar :title="title" @back="destroy">
      <template v-slot:right>
        <div class="right-action">
          <i
            v-if="checkFavorite(market.name)"
            class="ic-star"
            @click="addOrRemoveFavorite(market.name)"
          />
          <i
            v-else
            class="ic-no-star"
            @click="addOrRemoveFavorite(market.name)"
          />
        </div>
      </template>
    </head-bar>
    <div class="body-bar">
      <ticker-status :market="market" />
      <group-chart :market="market" />
      <group-trade :market="market" />
    </div>
    <tab-bar :market="market" />
  </panel-view>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { MarketChannels } from "@/mixins";
import { ScreenMixin, MarketMixin } from "@/mixins/mobile";
import * as helpers from "@zsmartex/z-helpers";
import config from "@/config";
import store from "@/store";

@Component({
  components: {
    "group-chart": () =>
      import("@/layouts/mobile/screens/market-preview/group-chart"),
    "group-trade": () =>
      import("@/layouts/mobile/screens/market-preview/group-trade"),
    "ticker-status": () =>
      import("@/layouts/mobile/screens/market-preview/ticker-status.vue"),
    "tab-bar": () =>
      import("@/layouts/mobile/screens/market-preview/tab-bar.vue")
  }
})
export default class MarketPreviewScreen extends Mixins(
  ScreenMixin,
  MarketMixin
) {
  market: ZTypes.Market = store.state.public.markets[0];
  widget = null;

  get title() {
    return this.market.name.replace("/", " / ");
  }

  mounted() {
    this.market = store.state.public.markets[0]; // For backup
  }

  before_panel_create(market: ZTypes.Market) {
    this.market = market;
    store.state.exchange.depth.clear();

    this.setTitle();
    store.dispatch("exchange/getMarketTrades", this.market.id);

    const channels = MarketChannels(this.market.id);

    channels.forEach(channel => {
      store.commit("websocket/subscribe", channel);
    });
  }

  before_panel_destroy() {
    const channels = MarketChannels(this.market.id);

    channels.forEach(channel => {
      store.commit("websocket/unsubscribe", channel);
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
@import "~@/assets/css/screens/market-preview";
</style>
