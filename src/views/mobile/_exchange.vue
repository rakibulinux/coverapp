<template>
  <z-content class="page-exchange-m">
    <head-bar :title="market.name.split('/').join(' / ')" :left-disabled="true">
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
      <div class="group-top">
        <trade-action class="group-top-left" />
        <order-book class="group-top-right" />
      </div>
      <mine-control class="group-bottom" />
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

@Component({
  components: {
    "order-book": () => import("@/layouts/mobile/exchange/order-book"),
    "trade-action": () => import("@/layouts/mobile/exchange/trade-action"),
    "mine-control": () => import("@/layouts/mobile/exchange/mine-control"),
    "head-bar": () => import("@/views/mobile/modules/head-bar.vue")
  }
})
export default class Exchange extends Mixins(MarketMixin) {
  selected = "Buy";

  get market() {
    const market_id = helpers.isMarket();
    const { markets } = store.state.public;

    return markets.find(market => market.id === market_id);
  }

  beforeDestroy() {
    this.removeLoad();
  }

  mounted() {
    this.onLoad();
  }

  trigger(value) {
    this.selected = value;
    this.$router.push("/m/exchange?type=" + value);
  }

  removeLoad() {
    MarketChannels(this.market.id).forEach(channel => {
      store.commit("websocket/unsubscribe", channel);
    });
  }

  onLoad() {
    this.setTitle();

    MarketChannels(this.market.id).forEach(channel => {
      store.commit("websocket/subscribe", channel);
    });
    store.dispatch("exchange/getMarketDepth");
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
