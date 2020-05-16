<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title">Reset Password</h3>
        <form @submit.prevent="ResetPassword">
          <auth-input
            v-model="password"
            name="password"
            type="password"
            :class-name="{ ierror: validPassword(), g: password }"
            :label-class="{ berror: validPassword() }"
            placeholder="Password"
            :label-need="true"
            :enable-vaild="validPassword()"
            :error-text="translation('password')"
          />
          <auth-input
            v-model="repassword"
            name="confirm_password"
            type="password"
            :class-name="{
              ierror: validPassword(true) && repassword,
              g: repassword
            }"
            :label-class="{ berror: validPassword(true) && repassword }"
            placeholder="Confirm Password"
            :label-need="true"
            :enable-vaild="validPassword(true) && repassword != ''"
            :error-text="translation('repassword')"
          />
          <button type="submit" :disabled="validPassword(true) || validPassword()">Reset Password</button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import * as helpers from "@zsmartex/z-helpers";
import ApiClient from "@zsmartex/z-apiclient";
import store from "@/store";
import AuthInput from "@/components/desktop/AuthInput.vue";
import Helpers from "./helpers";
import router from "@/router";

export default {
  mixins: [Helpers],
  data: () => ({
    password: "",
    repassword: "",
  }),
  methods: {
    ResetInput() {
      this.password = "";
      this.confirm_password = "";
      store.state.user.reset_password_token = "";
      router.push("/signin");
    },
    ResetPassword() {
      const token = store.state.user.reset_password_token;
      const { password, repassword } = this;
      new ApiClient("auth")
        .post("/identity/users/password/set_password", {
          token,
          password,
          confirm_password: repassword,
        })
        .then(() => {
          helpers.runNotice("warning", "Password was changed");
          this.ResetInput();
        })
        .catch((error) => {
          return this.ResetInput();
        });
    },
  },
  components: {
    "auth-input": AuthInput,
  },
};
</script>
