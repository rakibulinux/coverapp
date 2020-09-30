<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title">Forgot Password</h3>
        <form @submit.prevent="forgot_password">
          <auth-input
            v-model="email"
            name="email"
            :placeholder="$t('input.placeholder.email')"
            :placeholder-need="true"
            :error="email_error"
          />
          <button type="submit" :loading="loading" :disabled="button_disabled">
            <span>{{ $t("auth.forgot_password") }}</span>
            <span v-if="sended && wait != 0">({{ wait }})</span>
          </button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script>
import ApiClient from "@zsmartex/z-apiclient";
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import { setTimeout, setInterval } from "timers";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class ForgotPassword extends Vue {
  loading = false;
  sended = false;
  email = "";
  captcha_response = "";
  loading = false;
  wait = 0;
  WaitInterval = null;

  get email_error() {
    const { email } = this;
    if (!email.length) {
      return false;
    }

    if (!helpers.validEmail(email)) {
      return this.$t("auth.input_error.email");
    }
  }

  get button_disabled() {
    if (this.email_error || this.email.length === 0) return true;
    if (this.sended) return true;
    if (this.wait !== 0) return true;
  }

  async forgot_password() {
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
      this.loading = false;
      this.set_wait_interval();
      helpers.runNotice("success", this.$t("message.password.forgot"));
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  set_wait_interval() {
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
  }
}
</script>
