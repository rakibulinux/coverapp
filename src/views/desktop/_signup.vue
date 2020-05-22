<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title">
          Sign Up
        </h3>
        <form autocomplete="off" @submit.prevent="register">
          <auth-input
            v-model="email"
            name="email"
            placeholder="Email"
            :placeholder-need="true"
            :error="email_error"
          />
          <auth-input
            v-model="password"
            name="password"
            type="password"
            placeholder="Passsord"
            :placeholder-need="true"
            :error="password_error"
          />
          <auth-input
            v-model="confirm_password"
            name="confirm_password"
            type="password"
            placeholder="Confirm passsord"
            :placeholder-need="true"
            :error="confirm_password_error"
          />
          <auth-input
            v-model="refid"
            name="refid"
            placeholder="Referral UID"
            :error="refid_error"
          />
          <auth-button type="submit" :loading="loading" :disabled="buttonDisabled" >
            {{ $t("auth.register") }}
          </auth-button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue"),
  },
})
export default class App extends Vue {
  public loading = false;
  public email = "";
  public password = "";
  public confirm_password = "";
  public refid = "";
  public captcha_response = "";

  get buttonDisabled() {
    const { email, password, confirm_password, captcha_response } = this;
    const { email_error, password_error, confirm_password_error, refid_error } = this;

    const rule_1 = (email.length || password.length || confirm_password.length  || captcha_response.length);
    const rule_2 = (!email_error && !password_error && !confirm_password_error && !refid_error);
    let allow = rule_1 && rule_2;
    allow = allow && !this.loading;

    return !allow;
  }

  get email_error() {
    const { email } = this;
    if (!email.length) { return false; }

    if (!helpers.validEmail(email)) { return "Incorrect email address. Please enter again."; }
  }

  get password_error() {
    const { password } = this;
    if (!password.length) { return false; }

    if (!helpers.validPassword(password)) { return "Incorrect email address. Please enter again."; }
  }

  get confirm_password_error() {
    const { password, confirm_password } = this;
    if (!confirm_password.length) { return false; }

    if (confirm_password !== password) { return "Incorrect email address. Please enter again."; }
  }

  get refid_error() {
    const { refid } = this;
    if (!refid.length) { return false; }

    if (/^ID\w{10}$/g.test(refid)) { return "Incorrect email address. Please enter again."; }
  }

  public async register() {
    const { email, password, refid, captcha_response } = this;

    this.loading = true;
    await this.$store.dispatch("user/REGISTER", {
      email,
      password,
      refid,
      captcha_response,
    });
    this.loading = false;
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/desktop/auth";
</style>
