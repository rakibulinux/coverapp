<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title">Reset Password</h3>
        <form @submit.prevent="reset_password">
          <auth-input
            v-model="password"
            name="password"
            type="password"
            :placeholder="$t('input.placeholder.password')"
            :placeholder-need="true"
            :error="password_error"
          />
          <auth-input
            v-model="confirm_password"
            name="confirm_password"
            type="password"
            :placeholder="$t('input.placeholder.confirm_password')"
            :placeholder-need="true"
            :error="confirm_password_error"
          />
          <auth-button
            type="submit"
            :loading="loading"
            :disabled="button_disabled"
          >
            Reset Password
          </auth-button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import ApiClient from "@zsmartex/z-apiclient";
import store from "@/store";
import UserController from "@/controllers/user";
import { i18n } from "@/plugins";
import ZSmartModel from "@zsmartex/z-eventbus";
import { runNotice } from "@/mixins";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class ResetPassword extends Vue {
  public loading = false;
  public password = "";
  public confirm_password = "";

  get confirmation_reset_password_token() {
    return this.$route.query["confirmation_token"] as string;
  }

  get password_error() {
    const { password } = this;
    if (!password.length) {
      return false;
    }

    if (!helpers.validPassword(password)) {
      return "Incorrect email address. Please enter again.";
    }
  }

  get confirm_password_error() {
    const { password, confirm_password } = this;
    if (!confirm_password.length) {
      return false;
    }

    if (confirm_password !== password) {
      return "Incorrect email address. Please enter again.";
    }
  }

  get button_disabled() {
    const { password, confirm_password } = this;
    const { password_error, confirm_password_error } = this;

    if (password.length === 0 || confirm_password.length === 0) return true;
    if (password_error || confirm_password_error) return true;
  }

  mounted() {
    const lang = this.$route.query["lang"] as string;
    if (lang) {
      localStorage.setItem("LANGUAGE_HASH", lang);
      i18n.locale = lang;
      ZSmartModel.emit("change-language");
    }

    if (this.confirmation_reset_password_token) {
      this.check_token();
    } else {
      this.$router.push("/");
    }
  }

  async check_token() {
    this.loading = true;
    try {
      await UserController.check_code_reset_password(
        this.confirmation_reset_password_token
      );
      runNotice("success", "Mời bạn thay mk");
    } catch (error) {
      this.$router.push("/");
      return error;
    } finally {
      this.loading = false;
    }
  }

  async reset_password() {
    this.loading = true;
    await UserController.confirm_reset_password(
      this.confirmation_reset_password_token,
      this.password,
      this.confirm_password
    );
    this.loading = false;
  }
}
</script>
