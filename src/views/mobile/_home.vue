<template>
  <z-content class="page-home-m pull-content">
    <pull-to :last-update="lastUpdate" :top-load-method="refresh">
      <preview />
      <feature-markets />
      <top-btc-volume />
      <trend-top />
      <div class="more-market">
        <span @click="$router.push('/m/markets')">
          More
          <span>
            <a-icon type="down" />
            <a-icon type="down" />
          </span>
        </span>
      </div>
    </pull-to>
    <search-markets ref="search-markets" />
    <market-preview ref="market-preview" />
  </z-content>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import store from "@/store";
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "pull-to": () => import("@/components/mobile/pull-to"),
    preview: () => import("@/layouts/mobile/home/preview.vue"),
    "feature-markets": () => import("@/layouts/mobile/home/feature-markets"),
    "top-btc-volume": () => import("@/layouts/mobile/home/top-btc-volume.vue"),
    "trend-top": () => import("@/layouts/mobile/home/trend-top.vue"),
    "search-markets": () => import("@/views/mobile/screens/search-markets"),
    "market-preview": () => import("@/views/mobile/screens/market-preview")
  }
})
export default class Home extends Mixins(MarketMixin) {
  $refs!: {
    [key: string]: any;
  };

  get lastUpdate() {
    return store.state.public.lastUpdate;
  }

  mounted() {
    ZSmartModel.on("open-market-preview", args => {
      //this.removeSearchMarket();
      this.openMarketPreview(args);
    });
  }

  beforeDestroy() {
    ZSmartModel.remove("open-market-preview");
    ZSmartModel.remove("open-search-markets");
  }

  async refresh(loaded) {
    try {
      await store.dispatch("public/getTimeStamp");
      await store.dispatch("public/getGlobalPrice");
      await store.dispatch("public/getCurrencies");
      await store.dispatch("public/getMarkets");
      await store.dispatch("public/getSparkLines");
      await store.dispatch("public/getTickers");
      loaded("done");
    } catch (error) {
      loaded("failed");
      return error;
    }
  }

  // removeSearchMarket() {
  //   this.$refs["search-markets"].remove();
  // }

  removeMarketPreview() {
    this.$refs["market-preview"].delete();
  }

  // openSearchMarket() {
  //   this.$refs["search-markets"].render();
  // }

  openMarketPreview(args) {
    this.$refs["market-preview"].create(args);
  }
}
</script>

<style>
.child {
  height: 500px;
}
</style>
