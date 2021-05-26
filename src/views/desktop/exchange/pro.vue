<template>
  <z-content :key="identifier" class="page-exchange">
    <div class="group-left" :class="{ hide: hide_pairs_table }">
      <market-list />
    </div>
    <div class="group-middle">
      <ticker-status
        :hide_pairs_table="hide_pairs_table"
        @update-hide="val => (hide_pairs_table = val)"
      />
      <chart />
      <mine-control />
    </div>
    <div class="group-right">
      <div id="global_list">
        <order-book />
        <market-trades :loading="loading" />
      </div>
      <trade-action />
    </div>
  </z-content>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { ExchangeBaseMixin } from "@/mixins/exchange";

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
export default class PageExchangePro extends Mixins(ExchangeBaseMixin) {
  hide_pairs_table = false;

  mounted() {
    if (window.innerWidth < 1600) {
      this.hide_pairs_table = true;
    }
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/desktop/exchange";
</style>

