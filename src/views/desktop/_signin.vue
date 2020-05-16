<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title" v-text="$t('auth.login')" />
        <form @submit.prevent="login">
          <auth-input
            v-model="email"
            name="email"
            :class-name="{ ierror: !validEmail && email != '', g: email }"
            :label-class="{ berror: !validEmail && email != '' }"
            :placeholder="$t('placeholder.email')"
            :label-need="true"
            :enable-vaild="!validEmail && email != ''"
            :error-text="translation('email')"
          />
          <auth-input
            v-model="password"
            name="password"
            type="password"
            :class-name="{ g: password }"
            :placeholder="$t('placeholder.password')"
            :label-need="true"
          />
          <button type="submit" :disabled="buttonDisabled">
            <a-icon
              v-if="loading"
              type="loading"
              style="font-size: 24px"
              spin
            />
            {{ $t("auth.login") }}
          </button>
          <div>
            <router-link to="forgotpassword" class="forgot">
              Forgot Password?
            </router-link>
            <i18n path="auth.no_account" tag="div" class="text-right signup">
              <router-link to="signup" v-text="$t('auth.to_sign_up')" />
            </i18n>
          </div>
        </form>
      </div>
    </div>
    <modal-totp
      ref="totp"
      :payload="payload_modal"
      @onSubmit="onSubmitTotp"
      @onFailed="modalClose"
    />
  </z-content>
</template>

<script>
import store from "@/store";
import _modal_totp from "@/layouts/desktop/modal/_modal_totp";
import AuthInput from "@/components/desktop/AuthInput";
import Helpers from "./helpers";

export default {
  components: {
    "auth-input": AuthInput,
    "modal-totp": _modal_totp
  },
  mixins: [Helpers],
  data: () => ({
    loading: false,
    email: "",
    password: "",
    otp_code: "",
    captcha_response: "",
    payload_modal: {}
  }),
  computed: {
    buttonDisabled() {
      const { validEmail, password } = this;
      let allow = true;

      allow = validEmail && password;

      return !allow;
    },
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
  mounted() {},
  methods: {
    async callLogin() {
      const { email, password, otp_code, captcha_response } = this;

      this.loading = true;
      const payload = {
        email,
        password,
        otp_code,
        captcha_response
      }
      await store.dispatch("user/LOGIN", { payload });
      this.loading = false;
    },
    login() {
      if (this.need2fa) {
        if (this.otp_code.length >= 6) this.callLogin();
      } else {
        this.callLogin();
      }
    },
    modalClose() {
      this.need2fa = false;
      this.payload_modal = {};
    },
    onSubmitTotp(payload, totp_code) {
      this.otp_code = totp_code;
      this.login();
    },
    openTotp() {
      const modal = "totp";
      this.payload_modal = {
        email: this.email,
        password: this.password,
        modal
      };

      this.openModal(modal);
    },
    openModal(modal) {
      this.$nextTick(() => {
        this.$refs[modal].render();
      });
    }
  }
};
</script>
