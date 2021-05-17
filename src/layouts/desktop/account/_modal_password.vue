<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="password-modal"
    :footer="null"
    :width="400"
  >
    <need-security
      v-if="!UserController.otp"
      @closeModal="closeModal"
      @changeModal="changeModal"
    />
    <div v-else-if="UserController.otp && step === 1">
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        {{ translation("steps.1.title") }}
      </div>
      <div class="desc">
        {{ translation("steps.1.desc") }}
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
          {{ $t("page.global.action.save") }}
        </auth-button>
      </form>
    </div>
    <div v-else-if="UserController.otp && step === 2">
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        {{ translation("steps.2.title") }}
      </div>
      <div class="desc">
        {{ translation("steps.2.desc") }}
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
        <auth-button
          type="submit"
          :loading="loading"
          :disabled="!(otp_code.length === 6)"
        >
          {{ $t("page.global.action.confirm") }}
        </auth-button>
      </form>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "./helpers";
import ApiClient from "@zsmartex/z-apiclient";
import { runNotice } from "@/mixins";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class App extends Mixins(Helpers) {
  old_password = "";
  new_password = "";
  confirm_password = "";
  otp_code = "";

  mounted() {
    this.onCreate();
  }

  onCreate() {
    this.step = 1;
    this.old_password = "";
    this.new_password = "";
    this.confirm_password = "";
    this.otp_code = "";
  }

  vaild_password() {
    const { old_password, new_password, confirm_password } = this;
    if (!old_password || !new_password || !confirm_password) {
      return true;
    }
    return (
      !old_password ||
      old_password === new_password ||
      helpers.validPassword(new_password)
    );
  }

  async check_password() {
    this.loading = true;
    try {
      await new ApiClient("auth").post("resource/users/checkpassword", {
        password: this.old_password
      });
      this.step++;
      runNotice("warning", "password.need2fa");
      this.loading = true;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  async change_password() {
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
      this.delete();
      runNotice("success", "password.changed");
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  translation(message, data = {}) {
    return helpers.translation("modal.password." + message, data);
  }
}
</script>
