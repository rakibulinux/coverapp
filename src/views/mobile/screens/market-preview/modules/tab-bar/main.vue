<template>
  <div class="tab-bar">
    <div class="bg-up" @click="openTradesPage('buy')">
      Buy
    </div>
    <div class="bg-down" @click="openTradesPage('sell')">
      Sell
    </div>
  </div>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";
import { setTimeout } from "timers";

export default {
  props: {
    market: Array
  },
  methods: {
    openTradesPage(type) {
      ZSmartModel.emit("close-panel-view");
      const market = this.market.join("_");
      setTimeout(() => {
        this.$store.commit("public/SYNC_EXCHANGE", market);
      }, 300);
    }
  }
};
</script>
