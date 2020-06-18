<template>
  <panel-view v-if="isShowing" class="page-verify-m">
    <head-bar title="2FA" @on-remove="remove()" />
    <div class="body-bar"></div>
  </panel-view>
</template>

<script>
import Helpers from "@/views/mobile/helpers";
import methods from "../../methods";

export default {
  mixins: [methods, Helpers]
};
</script>
