<template>
  <transition name="panel-move">
    <panel-view v-if="isShowing" class="screen-totp-m">
      <head-bar title="TOTP Verification" @on-remove="remove()" />
      <div class="body-bar">
        <div class="totp-box">
          <input-setting
            v-model="otp_code"
            placeholder="OTP Code"
            type="number"
            maxlength="6"
          />

          <button type="submit" @click="onSubmit">
            Submit
          </button>
        </div>
      </div>
    </panel-view>
  </transition>
</template>

<script>
import methods from "../methods";

export default {
  mixins: [methods],
  data: () => ({
    loading: false, //TODO: add support loading for button submit
    otp_code: ""
  }),
  methods: {
    onSubmit() {
      this.$emit("on-submit", this.otp_code);
    },
    onRemove() {
      this.$emit("on-failed", null);
    }
  }
};
</script>
