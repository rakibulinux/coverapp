<template>
  <transition name="panel-move">
    <panel-view v-if="isShowing" class="screen-auth-m login">
      <head-bar :transparent="true" :left-disabled="true" @on-remove="remove()">
        <template v-slot:right>
          <div class="right-action">
            <i class="ic-aui-icon-close" @click="remove()" />
          </div>
        </template>
      </head-bar>
      <div class="body-bar">
        <form class="login-box" @submit.prevent="login()">
          <div class="logo"></div>
          <input-setting v-model="email" placeholder="Email Address" />
          <input-setting
            v-model="password"
            type="password"
            placeholder="Login password"
          />
          <button-setting type="submit" :disabled="!email || !password">
            Login
          </button-setting>
          <div class="note">
            <p><a>Forgot your password?</a></p>
            <p>
              Not have an account?
              <a @click="openPanel('panel-regisrer')">Register</a>
            </p>
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
  </transition>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";
import _confirm_password from "@/views/mobile/screens/auth/confirm_email";
import _regisrer from "@/views/mobile/screens/auth/register";
import totp_panel from "@/views/mobile/screens/totp";
import Helpers from "../helpers";

export default {
  components: {
    "panel-confirm-email": _confirm_password,
    "panel-regisrer": _regisrer,
    "totp-panel": totp_panel
  },
  mixins: [Helpers],
  data: () => ({
    email: "admin@zsmart.tech",
    password: "+MwLarx7huMyRcp@",
    otp_code: ""
  }),
  computed: {
    need2fa: {
      get() {
        return this.$store.state.user.need2fa;
      },
      set(value) {
        return (this.$store.state.user.need2fa = value);
      }
    }
  },
  watch: {
    need2fa() {
      if (this.need2fa) this.openTotp();
    }
  },
  methods: {
    openConfirmEmail() {
      this.openPanel("panel-confirm-email");
    },
    closeConfirmEmail() {
      this.closePanel("panel-confirm-email");
    },
    openTotp() {
      this.openPanel("totp-panel");
    },
    closeTotp() {
      this.closePanel("totp-panel");
    },
    openPanel(panel) {
      this.$refs[panel].render();
    },
    closePanel(panel) {
      this.$refs[panel].remove();
    },
    toptSubmit(otp_code) {
      this.otp_code = otp_code;
      this.login();
    },
    totpFailed() {
      this.need2fa = false;
    },
    async callLogin() {
      const { email, password, otp_code } = this;

      this.loading = true;
      await this.$store.dispatch("user/LOGIN", {
        email,
        password,
        otp_code
      });
      this.loading = false;
    },
    login() {
      if (this.need2fa) {
        if (this.otp_code.length >= 6) this.callLogin();
      } else {
        this.callLogin();
      }
    },
    onRender(func = null) {
      if (typeof func !== "function") return;
      ZSmartModel.on("login-success", () => {
        func();
      });
      ZSmartModel.on("wait-email", () => {
        this.openConfirmEmail();
      })
    }
  }
};
</script>
