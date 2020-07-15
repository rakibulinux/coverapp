<template>
  <z-content class="page-home-m pull-content">
    <head-bar
      @user-click="open_user_drawer"
      @search-click="open_search_market_screen"
    />
    <preview />
    <feature-markets @click="open_market_preview_screen" />
    <trend-top @click="open_market_preview_screen" />

    <user-drawer :allowTouch="allowTouch" ref="user-drawer" />
    <screen-search-markets
      ref="screen-search-markets"
      @click="open_market_preview_screen"
    />
    <screen-market-preview ref="screen-market-preview" />
  </z-content>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "head-bar": () => import("@/layouts/mobile/home/head-bar.vue"),
    preview: () => import("@/layouts/mobile/home/preview.vue"),
    "feature-markets": () => import("@/layouts/mobile/home/feature-markets"),
    "trend-top": () => import("@/layouts/mobile/home/trend-top.vue"),
    "user-drawer": () => import("@/layouts/mobile/home/user-drawer"),
    "screen-market-preview": () =>
      import("@/views/mobile/screens/market-preview"),
    "screen-search-markets": () =>
      import("@/views/mobile/screens/search-markets")
  }
})
export default class Home extends Mixins(MarketMixin) {
  $refs!: {
    [key: string]: any;
  };

  allowTouch() {
    if (
      !this.$refs["screen-search-markets"] ||
      !this.$refs["screen-market-preview"]
    )
      return true;

    if (
      this.$refs["screen-search-markets"].isActive ||
      this.$refs["screen-market-preview"].isActive
    )
      return false;

    return true;
  }

  open_user_drawer() {
    this.$refs["user-drawer"].create();
  }

  open_search_market_screen() {
    this.$refs["screen-search-markets"].create();
  }

  open_market_preview_screen(market: ZTypes.Market) {
    this.$refs["screen-market-preview"].create(market);
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/mobile/home";
</style>
