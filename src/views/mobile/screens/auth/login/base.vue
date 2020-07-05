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
      <form class="screen-auth-box" @submit.prevent="login">
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
            <a @click="$router.push('/m/auth/signup')">Sign Up</a>
          </p>
          <a class="screen-auth-action-item">Forgot password</a>
        </div>
      </form>
    </div>

    <screen-verify-otp ref="screen-verify-otp" />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { ScreenMixin } from "@/mixins/mobile";
import { Mixins, Component, Watch } from "vue-property-decorator";
import AuthMixin from "../mixins";
import ZSmartModel from "@zsmartex/z-eventbus";

@Component({
  components: {
    "panel-view": () => import("@/components/mobile/panel-view.vue"),
    "screen-verify-otp": () => import("@/views/mobile/screens/verify/totp.vue")
  }
})
export default class LoginScreen extends Mixins(ScreenMixin, AuthMixin) {
  $refs!: {
    [key: string]: ScreenMixin;
  };

  loading = false;
  email = "test@zsmart.tech";
  password = "J\\=v<Sfn7>8%W6S6";
  otp_code = "";
  button_rules = ["loading", "email", "password"];

  get need2fa() {
    return store.state.user.need2fa;
  }

  set need2fa(value: boolean) {
    store.state.user.need2fa = value;
  }

  onTotpSubmit(otp_code: string) {
    this.otp_code = otp_code;
    this.login();
  }

  async callLogin() {
    const { email, password, otp_code } = this;

    this.loading = true;
    await store.dispatch("user/LOGIN", {
      payload: {
        email,
        password,
        otp_code
      }
    });
    this.loading = false;
  }

  login() {
    if (this.need2fa) {
      if (this.otp_code.length >= 6) this.callLogin();
    } else {
      this.callLogin();
    }
  }

  mounted() {
    ZSmartModel.on("wait-email", () => {
      //TODO: open screen wait email
    });
  }

  beforeDestroy() {
    ZSmartModel.remove("wait-email");
  }

  @Watch("need2fa")
  onNeed2FAChanged(need2fa: boolean) {
    this.$refs["screen-verify-otp"][`${need2fa ? "create" : "close"}`]();
    if (!need2fa) {
      this.otp_code = "";
    }
  }
}
</script>

<style lang="less">
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
