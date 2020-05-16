<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title">
          Sign Up
        </h3>
        <form autocomplete="off" @submit.prevent="register">
          <auth-input
            ref="email"
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
            ref="password"
            v-model="password"
            name="password"
            type="password"
            :class-name="{
              ierror: !validPassword && password != '',
              g: password
            }"
            :label-class="{ berror: !validPassword && password != '' }"
            :placeholder="$t('placeholder.password')"
            :label-need="true"
            :enable-vaild="!validPassword && password != ''"
            :error-text="translation('password')"
          />
          <auth-input
            ref="confirm_password"
            v-model="confirm_password"
            name="confirm_password"
            type="password"
            :class-name="{
              ierror: !validConfirmPassword && confirm_password != '',
              g: confirm_password
            }"
            :label-class="{
              berror: !validConfirmPassword && confirm_password != ''
            }"
            :placeholder="$t('placeholder.repassword')"
            :label-need="true"
            :enable-vaild="!validConfirmPassword && confirm_password != ''"
            :error-text="translation('repassword')"
          />
          <auth-input
            ref="refid"
            v-model="refid"
            name="referral-uid"
            :class-name="{ ierror: validRefid(), g: refid }"
            :label-class="{ berror: validRefid() }"
            :placeholder="$t('placeholder.refid')"
            :enable-vaild="validRefid()"
            :error-text="translation('refid')"
          />
          <button type="submit" :disabled="buttonDisabled">
            {{ $t("auth.register") }}
          </button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script>
import AuthInput from "@/components/desktop/AuthInput.vue";
import Helpers from "./helpers";

export default {
  components: {
    "auth-input": AuthInput
  },
  mixins: [Helpers],
  data: () => ({
    email: "",
    password: "",
    confirm_password: "",
    refid: "",
    captcha_response: "",
    loading: false
  }),
  computed: {
    buttonDisabled() {
      const { validEmail, validPassword, validConfirmPassword } = this;
      let allow = true;

      allow = validEmail && validPassword && validConfirmPassword;

      return !allow;
    }
  },
  methods: {
    async register() {
      const { email, password, refid, captcha_response } = this;

      this.loading = true;
      await this.$store.dispatch("user/REGISTER", {
        email,
        password,
        refid,
        captcha_response
      });
      this.loading = false;
      this.resetInput();
    },
    resetInput() {
      this.$refs.email.clear();
      this.$refs.password.clear();
      this.$refs.confirm_password.clear();
      this.$refs.refid.clear();
    }
  }
};
</script>
