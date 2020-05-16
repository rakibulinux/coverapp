<template>
  <transition name="panel-move">
    <panel-view v-if="isShowing" class="screen-personal-m security">
      <head-bar
        title="Change Password"
        :loading="loading"
        @on-remove="remove()"
      />
      <div class="body-bar">
        <div class="change-password-box">
          <div v-if="step === 1">
            <input-setting
              v-model="old_password"
              placeholder="Old Password"
              type="password"
            />
            <input-setting
              v-model="new_password"
              placeholder="New Password"
              type="password"
            />
            <input-setting
              v-model="confirm_password"
              placeholder="Confirm Password"
              type="password"
            />
          </div>
          <div v-else>
            <input-setting
              v-model="otp_code"
              type="number"
              maxlength="6"
              placeholder="OTP Code"
            />
          </div>
        </div>

        <div class="action">
          <button type="submit" :disabled="buttonDisabled" @click="next">
            {{ getActionText }}
          </button>
        </div>
      </div>
    </panel-view>
  </transition>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "../../helpers";

export default {
  mixins: [Helpers],
  data: () => ({
    loading: false,
    step: 1,
    old_password: "",
    new_password: "",
    confirm_password: "",
    otp_code: ""
  }),
  computed: {
    buttonDisabled() {
      var allow = true;
      const {
        step,
        old_password,
        new_password,
        confirm_password,
        otp_code
      } = this;

      if (step === 1) {
        allow =
          old_password !== new_password &&
          new_password === confirm_password &&
          helpers.validPassword(new_password);
      } else {
        allow = otp_code.length === 6;
      }

      return !allow;
    },
    getActionText() {
      if (this.step === 1) return "Next";
      return "Submit";
    }
  },
  methods: {
    next() {
      if (this.step === 1) this.checkPassword();
      else this.changePSW();
    },
    async checkPassword() {
      this.loading = true;
      try {
        await new ApiClient("auth").post("resource/users/checkpassword", {
          password: this.old_password
        });
        this.step++;
        helpers.runNotice("warning", "U need enter otp code to continue");
        this.loading = true;
      } catch (error) {
        this.loading = false;
        return error;
      }
    },
    async changePSW() {
      this.loading = true;
      const { old_password, new_password, confirm_password, otp_code } = this;
      try {
        await new ApiClient("auth").put("resource/users/password", {
          old_password,
          new_password,
          confirm_password,
          otp_code
        });
        this.loading = false;
        helpers.runNotice("success", "Password changed");
        this.remove();
      } catch (error) {
        this.loading = false;
        return error;
      }
    }
  }
};
</script>
