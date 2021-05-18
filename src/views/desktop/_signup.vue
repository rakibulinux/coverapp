<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title" v-text="$t('page.auth.sign_up')" />
        <form autocomplete="off" @submit.prevent="register">
          <auth-input
            v-model="email"
            name="email"
            :placeholder="$t('page.global.placeholder.email')"
            :placeholder-need="true"
            :error="email_error"
          />
          <auth-input
            v-model="password"
            name="password"
            type="password"
            :placeholder="$t('page.global.placeholder.password')"
            :placeholder-need="true"
            :error="password_error"
          />
          <auth-input
            v-model="confirm_password"
            name="confirm_password"
            type="password"
            :placeholder="$t('page.global.placeholder.confirm_password')"
            :placeholder-need="true"
            :error="confirm_password_error"
          />
          <auth-input
            v-model="refid"
            name="refid"
            :placeholder="$t('page.global.placeholder.refid')"
            :error="refid_error"
          />
          <auth-button
            type="submit"
            :loading="loading"
            :disabled="buttonDisabled"
          >
            {{ $t("page.global.action.sign_up") }}
          </auth-button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import { UserController } from "@/controllers";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class SignUp extends Vue {
  public email = "";
  public password = "";
  public confirm_password = "";
  public refid = "";
  public captcha_response = "";

  get loading() {
    return UserController.state == "loading";
  }

  get buttonDisabled() {
    const { email, password, confirm_password, captcha_response } = this;
    const {
      email_error,
      password_error,
      confirm_password_error,
      refid_error
    } = this;

    const rule_1 =
      email.length ||
      password.length ||
      confirm_password.length ||
      captcha_response.length;
    const rule_2 =
      !email_error &&
      !password_error &&
      !confirm_password_error &&
      !refid_error;
    let allow = rule_1 && rule_2;
    allow = allow && !this.loading;

    return !allow;
  }

  get email_error() {
    const { email } = this;
    if (!email.length) {
      return false;
    }

    if (!helpers.validEmail(email)) {
      return this.$t("auth.input_error.email");
    }
  }

  get password_error() {
    const { password } = this;
    if (!password.length) {
      return false;
    }

    if (!helpers.validPassword(password)) {
      return this.$t("auth.input_error.password");
    }
  }

  get confirm_password_error() {
    const { password, confirm_password } = this;
    if (!confirm_password.length) {
      return false;
    }

    if (confirm_password !== password) {
      return this.$t("auth.input_error.confirm_password");
    }
  }

  get refid_error() {
    const { refid } = this;
    if (!refid.length) {
      return false;
    }

    if (!(/^ID\w{10}$/g.test(refid))) {
      return this.$t("auth.input_error.refid");
    }
  }

  async register() {
    if (this.loading) return;

    await UserController.register({
      email: this.email,
      password: this.password,
      refid: this.refid,
      captcha_response: this.captcha_response
    });
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/desktop/auth";
</style>
