<template>
  <panel-view class="orders-screen">
    <head-bar title="Orders" @back="destroy" />
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class OrdersScreen extends Mixins(ScreenMixin) {}
</script>

<style lang="less">
.orders-screen {
}
</style>
