<template>
  <z-content class="page-exchange-m">
    <head-bar :title="market.name.split('/').join(' / ')" :left-disabled="true">
      <template v-slot:right>
        <div class="right-action">
          <i
            :class="check_favorite(market.name) ? 'zicon-star' : 'zicon-no-star'"
            @click="add_remove_favorite(market.name)"
          />
        </div>
      </template>
    </head-bar>
    <div class="body-bar">
      <div class="group-top">
        <trade-action class="group-top-left" />
        <order-book class="group-top-right" />
      </div>
      <mine-control class="group-bottom" :market="market" />
    </div>
  </z-content>
</template>

<script lang="ts">
import store from "@/store";
import * as helpers from "@zsmartex/z-helpers";
import config from "@/config";
import { Mixins, Component } from "vue-property-decorator";
import { MarketChannels } from "@/mixins";
import { MarketMixin } from "@/mixins/mobile";
import { PublicController, TradeController, WebSocketController } from "@/controllers";

@Component({
  components: {
    "order-book": () => import("@/layouts/mobile/exchange/order-book"),
    "trade-action": () => import("@/layouts/mobile/exchange/trade-action"),
    "mine-control": () => import("@/layouts/mobile/exchange/mine-control"),
    "head-bar": () => import("@/views/mobile/modules/head-bar.vue")
  }
})
export default class Exchange extends Mixins(MarketMixin) {
  mounted() {
    this.onLoad();
  }

  beforeDestroy() {
    this.removeLoad();
  }

  removeLoad() {
    MarketChannels(this.market.id).forEach(channel => {
      WebSocketController.unsubscribe("public", channel);
    });
  }

  onLoad() {
    this.setTitle();
    TradeController.orderbook.clear();
    TradeController.orderbook.fetch(this.market.id);

    MarketChannels(this.market.id).forEach(channel => {
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
@import "~@/assets/css/views/mobile/exchange";
</style>
