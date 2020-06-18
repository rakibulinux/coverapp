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

<script lang="ts">
import store from "@/store";
import { Vue, Component, Prop } from "vue-property-decorator";
import ZSmartModel from "@zsmartex/z-eventbus";

@Component
export default class MarketPreviewTabBar extends Vue {
  @Prop() readonly market!: ZTypes.Market;

  openTradesPage(type) {
    const market = [this.market.base_unit, this.market.quote_unit].join("_");

    ZSmartModel.emit("close-panel-view");
    setTimeout(() => {
      store.commit("public/SYNC_EXCHANGE", { market, type });
    }, 300);
  }
}
</script>
