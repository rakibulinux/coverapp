<template>
  <panel-view class="search-markets">
    <head-bar v-model="search" @cancel="destroy" />
    <body-bar
      v-if="search"
      v-model="search"
      @click="open_market_preview_screen"
    />
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "head-bar": () =>
      import("@/layouts/mobile/screens/search-market/head-bar.vue"),
    "body-bar": () =>
      import("@/layouts/mobile/screens/search-market/body-bar.vue")
  }
})
export default class SearchMarketScreen extends Mixins(ScreenMixin) {
  search = "";

  open_market_preview_screen(market: ZTypes.Market) {
    this.$emit("click", market);
  }
}
</script>

<style lang="less">
@import "~@/assets/css/screens/search-markets";
</style>
