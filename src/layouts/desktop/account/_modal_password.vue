<template>
  <a-modal
    v-model="modal.enabled"
    wrap-class-name="password-modal"
    :footer="null"
    :width="400"
    @cancel="onChangeShow"
    @ok="onChangeShow"
  >
    <need-security
      v-if="!$store.state.user.otp"
      @closeModal="closeModal"
      @changeModal="changeModal"
    />
    <div v-else-if="$store.state.user.otp && step === 1">
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        Change password
      </div>
      <div class="desc">
        Don’t forget that your new pasword has to be different from the previous
        one.
      </div>
      <form @submit.prevent="checkPassword()">
        <auth-input
          ref="old_password"
          v-model="old_password"
          name="old_password"
          type="password"
          :value="old_password"
          :class-name="{ g: old_password }"
          placeholder="Old Password"
          :label-need="true"
        />
        <auth-input
          ref="new_password"
          v-model="new_password"
          name="new_password"
          type="password"
          :value="new_password"
          :class-name="{ g: new_password }"
          placeholder="New Password"
          :label-need="true"
        />
        <auth-input
          ref="confirm_password"
          v-model="confirm_password"
          name="confirm_password"
          type="password"
          :value="confirm_password"
          :class-name="{ g: confirm_password }"
          placeholder="Confirm Password"
          :label-need="true"
        />
        <button type="submit" :disabled="vaildPassword()">
          <a-icon
            v-if="modal.loading_button"
            type="loading"
            style="font-size: 24px"
            spin
          />
          Save
        </button>
      </form>
    </div>
    <div v-else-if="$store.state.user.otp && step === 2">
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        Google Authentication
      </div>
      <div class="desc">
        Enter the authentication code from the app below.
      </div>
      <form @submit.prevent="changePSW">
        <auth-input
          ref="otp_code"
          v-model="otp_code"
          name="otp_code"
          :value="otp_code"
          :class-name="{ g: otp_code }"
          placeholder="2FA Code"
          :label-need="true"
          maxlength="6"
          type="number"
        />
        <button type="submit" :disabled="!(otp_code.length === 6)">
          <a-icon
            v-if="modal.loading_button"
            type="loading"
            style="font-size: 24px"
            spin
          />
          {{ $t("auth.confirm") }}
        </button>
      </form>
    </div>
  </a-modal>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import AuthInput from "@/components/desktop/AuthInput.vue";
import Helpers from "./helpers";

export default {
  components: {
    "auth-input": AuthInput
  },
  mixins: [Helpers],
  data: () => ({
    step: 1,
    old_password: "",
    new_password: "",
    confirm_password: "",
    otp_code: ""
  }),
  methods: {
    vaildPassword() {
      const { step, old_password, new_password, confirm_password } = this;
      if (!old_password || !new_password || !confirm_password) return true;
      return (
        !old_password ||
        old_password === new_password ||
        helpers.validPassword(new_password) ||
        helpers.validPassword(new_password, confirm_password)
      );
    },
    resetInput() {
      this.old_password = this.new_password = this.confirm_password = "";
      this.resetStep();
    },
    async checkPassword() {
      this.modal.loading_button = true;
      try {
        await new ApiClient("auth").post("resource/users/checkpassword", {
          password: this.old_password
        });
        this.step++;
        helpers.runNotice("warning", "U need enter otp code to continue");
        this.modal.loading_button = true;
      } catch (error) {
        this.modal.loading_button = false;
        return error;
      }
    },
    async changePSW() {
      this.modal.loading_button = true;
      const { old_password, new_password, confirm_password, otp_code } = this;
      try {
        await new ApiClient("auth").put("resource/users/password", {
          old_password,
          new_password,
          confirm_password,
          otp_code
        });
        this.modal.loading_button = false;
        this.remove();
        helpers.runNotice("success", "Password changed");
      } catch (error) {
        this.modal.loading_button = false;
        return error;
      }
    }
  }
};
</script>
