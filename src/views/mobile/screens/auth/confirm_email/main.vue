<template>
  <panel-view v-if="isShowing" class="screen-auth-m login">
    <head-bar title="Confirm Email" @on-remove="remove()" />
    <div class="body-bar">
      <div class="confirm-password-box"></div>
    </div>
  </panel-view>
</template>

<script>
import Helpers from "../helpers";

export default {
  mixins: [Helpers]
};
</script>
