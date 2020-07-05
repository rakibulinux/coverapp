<template>
  <div class="screen-auth confirm-email">
    <head-bar title="Confirm Email" />

    <div class="body-bar">
      <div class="confirm-password-box"></div>
    </div>
  </div>
</template>

<script>
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class ScreenConfirmEmail extends Mixins(ScreenMixin) {}
</script>
