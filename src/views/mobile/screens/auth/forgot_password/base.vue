<template>
  <panel-view class="screen-auth confirm-email">
    <head-bar @back="destroy" />

    <div class="body-bar">
      <div class="screen-auth-box">
        <div class="screen-auth-logo" />
        <div class="screen-auth-title">
          <span v-if="step == 1">Forgot Password</span>
          <span v-if="step == 2">Confirm</span>
          <span v-if="step == 3">Reset Password</span>
        </div>

        <template v-if="step == 1">
          <auth-input
            v-model="email"
            name="email"
            type="text"
            placeholder="Email"
            :error="email_error"
          />

          <auth-button
            :loading="loading || loading_resend"
            :disabled="!email || email_error"
            @click="forgot_password"
          >
            {{ $t("auth.forgot_password") }}
          </auth-button>
        </template>
        <template v-else-if="step == 2">
          <auth-input
            v-model="confirmation_code"
            name="confirmation_code"
            maxlength="6"
            type="text"
            placeholder="E-mail verification code"
          >
            <template slot="suffix">
              <button
                style="padding: 0;width: 50px;font-weight: 500;"
                :disabled="this.cooldown > 0"
                @click.prevent="forgot_password"
              >
                <span v-if="this.loading_resend">
                  {{ $t("page.global.action.sending") }}
                </span>
                <span v-else>{{ this.cooldown ? $t("page.global.action.resend") : $t("page.global.action.send_code") }}</span>
                <span v-if="cooldown">({{ cooldown }})</span>
              </button>
            </template>
          </auth-input>

          <auth-button
            :loading="loading"
            :disabled="confirmation_code.length < 6"
            @click="check_token"
          >
            Submit
          </auth-button>
        </template>
        <template v-else>
          <auth-input
            v-model="password"
            name="password"
            type="password"
            :placeholder="$t('input.placeholder.password')"
            :error="password_error"
          />
          <auth-input
            v-model="confirm_password"
            name="confirm_password"
            type="password"
            :placeholder="$t('input.placeholder.confirm_password')"
            :error="confirm_password_error"
          />

          <auth-button
            :loading="loading"
            :disabled="password_error || confirm_password_error"
            @click="reset_password"
          >
            Reset Password
          </auth-button>
        </template>
      </div>
    </div>
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { ConfirmationMixin } from "@/mixins";
import { Component, Mixins } from "vue-property-decorator";
import { UserController } from "@/controllers";
import * as helpers from "@zsmartex/z-helpers";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button")
  }
})
export default class ScreenConfirmEmail extends Mixins(
  ScreenMixin,
  ConfirmationMixin
) {
  step = 1;
  loading_resend = false;
  loading = false;
  sended = false;
  email = "";
  captcha_response = "";
  password = "";
  confirm_password = "";

  before_panel_create() {
    this.step = 1;
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
      return "Incorrect email address. Please enter again.";
    }
  }

  get confirm_password_error() {
    const { password, confirm_password } = this;
    if (!confirm_password.length) {
      return false;
    }

    if (confirm_password !== password) {
      return "Incorrect email address. Please enter again.";
    }
  }

  async forgot_password() {
    this.loading_resend = true;

    await UserController.forgot_password(
      this.email,
      this.captcha_response,
      () => {
        this.start_cooldown();
        this.step++;
      }
    );

    this.loading_resend = false;
  }

  async check_token() {
    this.loading = true;
    await UserController.check_code_reset_password(
      this.email,
      this.confirmation_code,
      () => {
        this.step++;
      }
    );
    this.loading = false;
  }

  async reset_password() {
    this.loading = true;

    await UserController.confirm_reset_password(
      this.email,
      this.confirmation_code,
      this.password,
      this.confirm_password,
      () => {
        this.destroy();
      }
    );

    this.loading = false;
  }
}
</script>
