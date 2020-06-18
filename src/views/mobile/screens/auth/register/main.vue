<template>
  <panel-view v-if="isShowing" class="screen-auth-m register">
    <head-bar :transparent="true" :left-disabled="true" @on-remove="remove()">
      <template v-slot:right>
        <div class="right-action">
          <i class="ic-aui-icon-close" @click="remove()" />
        </div>
      </template>
    </head-bar>
    <div class="body-bar">
      <form class="register-box" @submit.prevent="register()">
        <div class="logo"></div>

        <input-setting v-model="email" placeholder="Email Address" />

        <input-setting
          v-model="password"
          type="password"
          placeholder="Login password"
        />

        <input-setting
          v-model="confirm_password"
          type="password"
          placeholder="Confirm password"
        />

        <div></div>

        <button-setting type="submit" :disabled="buttonDisabled">
          Register
        </button-setting>

        <div class="note">
          <p>Already Registed? <a @click="remove()">Login</a></p>
        </div>
      </form>
    </div>
  </panel-view>
</template>

<script>
import Helpers from "../helpers";

export default {
  mixins: [Helpers],
  data: () => ({
    loading: false,
    email: "",
    password: "",
    confirm_password: "",
    refid: "",
    captcha_response: ""
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
    }
  }
};
</script>
