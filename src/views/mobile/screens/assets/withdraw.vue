<template>
  <panel-view class="screen-assets-withdraw">
    <head-bar title="Withdraw" @back="destroy" />
  </panel-view>
</template>

<script lang="ts">
import store from "@/store";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";
import { PublicController } from "@/controllers";

@Component
export default class AssetsWithdrawScreen extends Mixins(ScreenMixin) {
  currency = PublicController.currencies[0];

  before_panel_create(currency: ZTypes.Currency) {
    this.currency = currency;
  }
}
</script>
