<template>
  <panel-view class="screen-assets screen-assets-history">
    <head-bar title="History" @back="destroy">
    </head-bar>
    <z-page-slide v-model="slide_key" :slide_items="SLIDE_ITEM">
      <template slot="deposit">
        <span>deposit</span>
      </template>
      <template slot="withdrawal">
        <span>withdrawal</span>
      </template>
    </z-page-slide>
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "z-page-slide": () => import("@/components/mobile/z-page-slide")
  }
})
export default class ScreenAssetsHistory extends Mixins(ScreenMixin) {
  slide_key = "";

  get SLIDE_ITEM() {
    return [
      {
        key: "deposit",
        label: "Deposit",
        value: "deposit"
      },
      {
        key: "withdrawal",
        label: "Withdrawal",
        value: "withdrawal"
      }
    ];
  }

  before_panel_create(type: string) {
    this.slide_key = type;
  }
}
</script>
