<template>
  <div class="screen-auth">
    <head-bar :left-disabled="true">
      <template v-slot:right>
        <div class="right-action">
          <i class="ic-aui-icon-close" @click="back" />
        </div>
      </template>
    </head-bar>
    <div class="body-bar">
      <form class="screen-auth-box" @submit.prevent="register">
        <div class="screen-auth-logo" />
        <div class="screen-auth-title">
          Sign Up
        </div>

        <auth-input
          v-model="email"
          name="email"
          type="text"
          placeholder="Email"
          :error="email_error"
        />
        <auth-input
          v-model="password"
          name="password"
          type="password"
          placeholder="Password"
          :error="password_error"
        />
        <auth-input
          v-model="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="Confirm password"
          :error="confirm_password_error"
        />
        <auth-input
          v-model="refid"
          name="refid"
          type="text"
          placeholder="Referral UID"
          :error="refid_error"
        />
        <auth-button
          type="submit"
          :loading="loading"
          :disabled="button_disabled"
        >
          Sign Up
        </auth-button>

        <div class="screen-auth-action">
          <p class="screen-auth-action-item">
            Already have an account? <a @click="back">Login</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import AuthMixin from "../mixins";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class SignUpScreen extends Mixins(ScreenMixin, AuthMixin) {
  loading = false;
  email = "";
  password = "";
  confirm_password = "";
  refid = "";
  captcha_response = "";

  button_rules = ["loading", "email", "password", "confirm_password"];

  open_login_page() {
    const { prev_path } = store.state.public;

    prev_path.includes("/m/auth/login")
      ? this.back()
      : this.$router.push({ path: "/m/auth/login" });
  }

  async register() {
    const { email, password, refid, captcha_response } = this;

    this.loading = true;
    await store.dispatch("user/REGISTER", {
      email,
      password,
      refid,
      captcha_response
    });
    this.loading = false;
  }
}
</script>
