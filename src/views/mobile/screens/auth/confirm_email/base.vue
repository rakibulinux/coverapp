<template>
  <panel-view v-if="isShowing" class="screen-auth confirm-email">
    <head-bar title="Confirm Email" @on-remove="remove()" />
    <div class="body-bar">
      <div class="confirm-password-box"></div>
    </div>
  </panel-view>
</template>

<script>
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class ScreenConfirmEmail extends Mixins(ScreenMixin) {}
</script>
