<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title">Forgot Password</h3>
        <form @submit.prevent="ForgotPassword">
          <auth-input
            v-model="email"
            name="email"
            :class-name="{ ierror: validEmail(email), g: email }"
            :label-class="{ berror: validEmail(email) }"
            placeholder="Email"
            :label-need="true"
            :enable-vaild="validEmail(email)"
            :error-text="translation('email')"
          />
          <button
            type="submit"
            :disabled="
              validEmail(email, true) ||
                !captcha_response ||
                (sended && wait != 0)
            "
          >
            <span>Forgot Password</span>
            <span v-if="sended && wait != 0">({{ wait }})</span>
          </button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import AuthInput from "@/components/desktop/AuthInput.vue";
import Helpers from "./helpers";
import { setTimeout, setInterval } from "timers";

export default {
  mixins: [Helpers],
  data: () => ({
    sended: false,
    email: "",
    captcha_response: "",
    loading: false,
    wait: 0,
    WaitInterval: null
  }),
  methods: {
    async ForgotPassword() {
      const { email, captcha_response } = this;

      this.loading = true;
      try {
        await new ApiClient("auth").post(
          "/identity/users/password/generate_code",
          {
            email,
            captcha_response
          }
        );
        helpers.runNotice(
          "success",
          "Password reset link has been sent to your email"
        );
        this.sended = true;
        this.wait = 60;
        setTimeout(() => {
          clearInterval(this.WaitInterval);
          this.sended = false;
          this.wait = 0;
        }, 60000);
        this.WaitInterval = setInterval(() => {
          this.wait--;
        }, 1000);
      } catch (error) {
        return error;
      }
    }
  }
};
</script>
