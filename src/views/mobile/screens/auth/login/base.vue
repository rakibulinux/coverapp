<template>
  <panel-view v-if="isShowing" class="screen-auth">
    <head-bar :transparent="true" :left-disabled="true" @on-remove="remove()">
      <template v-slot:right>
        <div class="right-action">
          <i class="ic-aui-icon-close" @click="remove" />
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
            <a @click="openPanel('panel-regisrer')">Sign Up</a>
          </p>
          <a class="screen-auth-action-item">Forgot password</a>
        </div>
      </form>
    </div>
    <totp-panel
      ref="totp-panel"
      @on-submit="toptSubmit"
      @on-failed="totpFailed"
    />
    <panel-regisrer ref="panel-regisrer" />
    <panel-confirm-email ref="panel-confirm-email" />
  </panel-view>
</template>

<script lang="ts">
import store from "@/store";
import { ScreenMixin } from "@/mixins/mobile";
import { Mixins, Component, Watch } from "vue-property-decorator";
import AuthMixin from "../mixins";
import ZSmartModel from "@zsmartex/z-eventbus";

@Component({
  components: {
    "panel-confirm-email": () => import("../confirm_email"),
    "panel-regisrer": () => import("../signup"),
    "totp-panel": () => import("@/views/mobile/screens/totp")
  }
})
export default class LoginScreen extends Mixins(ScreenMixin, AuthMixin) {
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

  openPanel(panel) {
    (this.$refs[panel] as any).create();
  }

  closePanel(panel) {
    (this.$refs[panel] as any).remove();
  }

  toptSubmit(otp_code) {
    this.otp_code = otp_code;
    this.login();
  }

  totpFailed() {
    this.need2fa = false;
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

  onRender(func = null) {
    if (typeof func !== "function") return;
    ZSmartModel.on("login-success", () => {
      this.delete();
    });
    ZSmartModel.on("wait-email", () => {
      this.openPanel("panel-confirm-email");
    });
  }

  onDelete() {
    ZSmartModel.remove("wait-email");
  }

  @Watch("need2fa")
  onNeed2FAChanged(need2fa: boolean) {
    if (need2fa) this.openPanel("totp-panel");
  }
}
</script>

<style lang="less">
.screen-auth {
  .screen-auth-action {
    &-item {
      &.signup {
        font-size: 10px;
      }
    }
  }
}
</style>
