<template>
  <panel-view class="screen-auth">
    <head-bar :left-disabled="true">
      <template v-slot:right>
        <div class="right-action">
          <i class="zicon-aui-icon-close" @click="destroy" />
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
            Already have an account? <a @click="destroy">Login</a>
          </p>
        </div>
      </form>
    </div>
  </panel-view>
</template>

<script lang="ts">
import store from "@/store";
import { AuthMixin } from "@/mixins";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button"),
  }
})
export default class SignUpScreen extends Mixins(ScreenMixin, AuthMixin) {
  email = "";
  password = "";
  confirm_password = "";
  refid = "";
  captcha_response = "";

  button_rules = ["loading", "email", "password", "confirm_password"];

  async register() {
    const { email, password, refid, captcha_response } = this;

    // this.loading = true;
    // await store.dispatch("user/REGISTER", {
    //   email,
    //   password,
    //   refid,
    //   captcha_response
    // });
    // this.loading = false;
  }
}
</script>

<style lang="less">
@import "~@/assets/css/screens/auth";
</style>
