<template>
  <div class="screen-assets-withdraw">
    <head-bar title="Withdraw" />
  </div>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class AssetsWithdrawScreen extends Mixins(ScreenMixin) {}
</script>
