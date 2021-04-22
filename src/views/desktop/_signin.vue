<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title" v-text="$t('auth.login')" />
        <form @submit.prevent="login">
          <auth-input
            v-model="email"
            name="email"
            :placeholder="$t('input.placeholder.email')"
            :placeholder-need="true"
            :error="email_error"
          />
          <auth-input
            v-model="password"
            name="password"
            type="password"
            :placeholder="$t('input.placeholder.password')"
            :placeholder-need="true"
            :error="password_error"
          />
          <auth-button type="submit" :loading="loading" :disabled="button_disabled">
            {{ $t("auth.login") }}
          </auth-button>
          <div>
            <router-link to="forgotpassword" class="forgot">
              Forgot Password?
            </router-link>
            <div class="text-right signup">
              {{ $t("auth.no_account") }}
              <router-link to="signup" v-text="$t('auth.to_sign_up')" />
            </div>
          </div>
        </form>
      </div>
    </div>
    <modal-totp
      ref="modal-totp"
      :loading="loading"
      @submit="onSubmitTotp"
      @close="modalClose"
    />
  </z-content>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import ModalTotp from "@/layouts/desktop/modal/_modal_totp.vue";
import { UserController } from "@/controllers";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue"),
    "modal-totp": ModalTotp
  }
})
export default class SignIn extends Vue {
  public $refs!: {
    "modal-totp": ModalTotp;
  };
  public email = "";
  public password = "";
  public otp_code = "";
  public captcha_response = "";
  public payload_modal = {};

  get loading() {
    return UserController.state == "loading";
  }

  get button_disabled() {
    const { email_error, password_error } = this;

    return (
      email_error ||
      password_error ||
      !this.email.length ||
      !this.password.length
    );
  }

  get need2fa() {
    return UserController.need2fa;
  }

  set need2fa(need2fa) {
    UserController.need2fa = need2fa;
  }

  get email_error() {
    const { email } = this;
    if (!email.length) {
      return false;
    }

    if (!helpers.validEmail(email)) {
      return this.$t("auth.input_error.email");
    }
  }

  get password_error() {
    const { password } = this;
    if (!password.length) {
      return false;
    }

    if (!helpers.validPassword(password)) {
      return this.$t("auth.input_error.password");
    }
  }

  public async callLogin() {
    const { email, password, otp_code, captcha_response } = this;

    await UserController.login(
      {
        email,
        password,
        otp_code,
        captcha_response
      },
      "/account/security"
    );
  }

  public login() {
    if (this.need2fa) {
      if (this.otp_code.length >= 6) {
        this.callLogin();
      }
    } else {
      this.callLogin();
    }
  }

  public modalClose() {
    this.need2fa = false;
  }

  public onSubmitTotp(totp_code) {
    this.otp_code = totp_code;
    this.login();
  }

  public openTotp() {
    this.$refs["modal-totp"].create();
  }

  @Watch("need2fa")
  public onNeed2FAChange(need2fa: boolean) {
    if (need2fa) {
      this.openTotp();
    }
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/desktop/auth";
</style>
