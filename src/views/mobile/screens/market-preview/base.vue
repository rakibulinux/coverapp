<template>
  <div v-if="market_id" class="market-preview">
    <head-bar :title="market.name.split('/').join(' / ')">
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
      <ticker-status
        :market="market"
        :get-price="getPrice"
        :get-amount="getAmount"
        :percent-to-number="percentToNumber"
      />
      <group-chart :market="market" />
      <group-trade
        :get-price="getPrice"
        :get-amount="getAmount"
        :get-time="getTime"
      />
    </div>
    <tab-bar :market="market" />
  </div>
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
export default class MarketPreview extends Mixins(ScreenMixin, MarketMixin) {
  widget = null;
  market_id = "";

  get market() {
    return store.state.public.markets.find(
      market => market.id === this.market_id
    );
  }

  mounted() {
    this.market_id = this.$route.params.market_id;

    store.dispatch("exchange/getMarketDepth", this.market_id);
    store.dispatch("exchange/getMarketTrades", this.market_id);
  }

  beforeDestroy() {
    this.removeLoad();
  }

  removeLoad() {
    const channels = MarketChannels(this.market_id);

    channels.forEach(channel => {
      store.commit("websocket/unsubscribe", channel);
    });
  }

  onLoad() {
    this.setTitle();

    const channels = MarketChannels(this.market.id);

    channels.forEach(channel => {
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
