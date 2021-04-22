<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="api-modal"
    :footer="null"
    :width="400"
  >
    <need-security
      v-if="!otp_enabled"
      @close-modal="closeModal"
      @change-modal="changeModal"
    />
    <div v-else-if="step === 1">
      <img src="@/assets/img/Google_Authenticator.png" class="logo-modal" />
      <div class="title">
        Create ApiKey
      </div>
      <div class="desc">
        Enter the authentication code from the app below.
      </div>
      <form @submit.prevent="create_api_key">
        <auth-input
          v-model="otp_code"
          name="otp_code"
          placeholder="2FA Code"
          :placeholder-need="true"
          maxlength="6"
          type="number"
        />
        <auth-button
          type="submit"
          :loading="loading"
          :disabled="disabled_button"
        >
          {{ $t("auth.confirm") }}
        </auth-button>
      </form>
    </div>
    <div v-else>
      <div class="info-warning">
        <a-icon type="warning" />
        <p>
          <span>API Key Created</span>
          <br />This information will be shown only once and cannot be retrieved
          once lost. Please store it properly.
        </p>
      </div>
      <form @submit.prevent="closeModal">
        <auth-input
          name="access_key"
          :value="api_key"
          placeholder="Access Key"
          :placeholder-need="true"
          :disabled="true"
        />
        <auth-input
          :value="api_secret"
          name="secret_key"
          type="number"
          placeholder="Secret Key"
          :placeholder-need="true"
          :disabled="true"
        />
        <auth-button type="submit">
          {{ $t("auth.confirm") }}
        </auth-button>
      </form>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { UserController } from "@/controllers";
import { Component, Mixins } from "vue-property-decorator";
import Helpers from "./helpers";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class App extends Mixins(Helpers) {
  otp_code = "";
  step = 1;
  api_key = "";
  api_secret = "";

  get disabled_button() {
    return !(this.otp_code.length === 6);
  }

  get otp_enabled() {
    return UserController.otp;
  }

  onCreate() {
    this.otp_code = "";
    this.step = 1;
  }

  closeModal() {
    this.delete();
  }

  async create_api_key() {
    this.loading = true;
    try {
      const { data } = await this.UserController.create_api_key(
        "HS256",
        this.otp_code
      );
      const { kid, secret } = data;

      this.api_key = kid;
      this.api_secret = secret;
      this.step++;

      this.$emit("success");
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }
}
</script>
