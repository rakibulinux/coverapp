<template>
  <panel-view class="screen-auth">
    <head-bar :left-disabled="true">
      <template v-slot:right>
        <div class="right-action">
          <i class="zicon-close" @click="destroy" />
        </div>
      </template>
    </head-bar>

    <div class="body-bar">
      <form class="screen-auth-box" @submit.prevent="login()">
        <div class="screen-auth-logo" />
        <div class="screen-auth-title">
          Log In
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
        <auth-button
          type="submit"
          :loading="loading"
          :disabled="button_disabled"
        >
          Log In
        </auth-button>
        <div class="screen-auth-action">
          <p class="screen-auth-action-item signup">
            <a @click="open_signup_screen">Sign Up</a>
          </p>
          <a class="screen-auth-action-item">Forgot password</a>
        </div>
      </form>
    </div>

    <screen-auth-signup ref="screen-auth-signup" />
    <screen-verify-otp
      ref="screen-verify-otp"
      @submit="login"
      @cancel="need2fa = false"
    />
  </panel-view>
</template>

<script lang="ts">
import store from "@/store";
import { ScreenMixin } from "@/mixins/mobile";
import { Mixins, Component, Watch } from "vue-property-decorator";
import { AuthMixin } from "@/mixins";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import { UserController } from "@/controllers";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button"),
    "screen-verify-otp": () => import("@/views/mobile/screens/verify/totp.vue"),
    "screen-auth-signup": () => import("@/views/mobile/screens/auth/signup")
  }
})
export default class LoginScreen extends Mixins(ScreenMixin, AuthMixin) {
  $refs!: {
    [key: string]: ScreenMixin;
  };

  email = "demo@zsmart.tech";
  password = "J\\=v<Sfn7>8%W6S6";
  otp_code = "";
  button_rules = ["loading", "email", "password"];

  get need2fa() {
    return UserController.need2fa;
  }

  set need2fa(value: boolean) {
    UserController.need2fa = value;
  }

  panel_created(callback?: Function) {
    this.$on("login-success", () => {
      if (typeof callback === "function") callback();
    });
  }

  before_panel_destroy() {
    ZSmartModel.remove("wait-email");
  }

  open_signup_screen() {
    this.$refs["screen-auth-signup"].create();
  }

  onTotpSubmit(otp_code: string) {
    this.otp_code = otp_code;
    this.login();
  }

  async callLogin() {
    const { email, password, otp_code } = this;

    await UserController.login({ email, password, otp_code }, "/m");

    if (UserController.state != "active") return;

    this.$emit("login-success", "");

    this.$nextTick(() => {
      this.destroy();
    });
  }

  login(otp_code?: string) {
    if (otp_code) this.otp_code = otp_code;

    if (this.need2fa) {
      if (this.otp_code.length >= 6) this.callLogin();
    } else {
      this.callLogin();
    }
  }

  @Watch("need2fa")
  onNeed2FAChanged(need2fa: boolean) {
    this.$refs["screen-verify-otp"][`${need2fa ? "create" : "destroy"}`]();
    this.otp_code = "";
  }
}
</script>

<style lang="less">
@import "~@/assets/css/screens/auth";

.screen-auth {
  .head-bar {
    background-color: transparent;
  }

  .screen-auth-action {
    &-item {
      &.signup {
        font-size: 10px;
      }
    }
  }
}
</style>
