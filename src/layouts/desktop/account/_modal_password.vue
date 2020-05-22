<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="password-modal"
    :footer="null"
    :width="400"
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
      <form @submit.prevent="check_password()">
        <auth-input
          v-model="old_password"
          name="old_password"
          type="password"
          placeholder="Old Password"
          :placeholder-need="true"
        />
        <auth-input
          v-model="new_password"
          name="new_password"
          type="password"
          placeholder="New Password"
          :placeholder-need="true"
        />
        <auth-input
          v-model="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          :placeholder-need="true"
        />
        <auth-button type="submit" :disabled="vaild_password()">
          Save
        </auth-button>
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
      <form @submit.prevent="change_password">
        <auth-input
          v-model="otp_code"
          name="otp_code"
          placeholder="2FA Code"
          :placeholder-need="true"
          maxlength="6"
          type="number"
        />
        <auth-button type="submit" :loading="loading" :disabled="!(otp_code.length === 6)">
          {{ $t("auth.confirm") }}
        </auth-button>
      </form>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "./helpers";
import ApiClient from "@zsmartex/z-apiclient";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue"),
  },
})
export default class App extends Mixins(Helpers) {
  public old_password = "";
  public new_password = "";
  public confirm_password = "";
  public otp_code = "";

  public mounted() {
    this.onCreate();
  }

  public onCreate() {
    this.step = 1;
    this.old_password = "";
    this.new_password = "";
    this.confirm_password = "";
    this.otp_code = "";
  }

  public vaild_password() {
    const { step, old_password, new_password, confirm_password } = this;
    if (!old_password || !new_password || !confirm_password) { return true; }
    return (
      !old_password ||
      old_password === new_password ||
      helpers.validPassword(new_password)
    );
  }

  public async check_password() {
    this.loading = true;
    try {
      await new ApiClient("auth").post("resource/users/checkpassword", {
        password: this.old_password,
      });
      this.step++;
      helpers.runNotice("warning", "U need enter otp code to continue");
      this.loading = true;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  public async change_password() {
    this.loading = true;
    const { old_password, new_password, confirm_password, otp_code } = this;
    try {
      await new ApiClient("auth").put("resource/users/password", {
        old_password,
        new_password,
        confirm_password,
        otp_code,
      });
      this.loading = false;
      this.delete();
      helpers.runNotice("success", "Password changed");
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

}
</script>
