<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title">Forgot Password</h3>
        <form @submit.prevent="forgot_password">
          <auth-input
            v-model="email"
            name="email"
            placeholder="Email"
            :placeholder-need="true"
            :error="email_error"
          />
          <button type="submit" :loading="loading" :disabled="button_disabled">
            <span>Forgot Password</span>
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
export default class App extends Vue {
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
      return "Incorrect email address. Please enter again.";
    }
  }

  get button_disabled() {
    const role_1 = !this.email_error;
    const role_2 = !this.sended && this.wait !== 0;
    const allow = role_1 && role_2;

    return !allow;
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
      helpers.runNotice(
        "success",
        "Password reset link has been sent to your email"
      );
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
