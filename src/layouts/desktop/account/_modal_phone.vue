<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="phone-modal"
    :footer="null"
    :width="400"
  >
    <button
      v-show="step > 1"
      type="button"
      aria-label="Action"
      class="ant-modal-action"
      @click="step--"
    >
      <span class="ant-modal-action-x">
        <i class="zicon-arrow-back" />
      </span>
    </button>
    <div v-if="step === 1">
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        Phone number
      </div>
      <div class="desc">
        Enter your phone number so we can send you an SMS with the
        authentication code.
      </div>
      <form v-if="UserController.phone" @submit.prevent="sendCode">
        <div class="phone-number">
          <auth-input
            v-model="phone_number"
            name="phone_number"
            prefix="+"
            placeholder="Phone number"
            :placeholder-need="true"
            :error="phone_number_error"
            type="number"
          />
        </div>
        <auth-button
          type="submit"
          :loading="loading"
          :disabled="button_disabled"
        >
          Send Code
        </auth-button>
      </form>
    </div>
    <div v-else>
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        Authentication
      </div>
      <div class="desc">
        Please enter the SMS verification code below +{{ phone_number }} . Enter
        below.
      </div>
      <form @submit.prevent="verifyCode">
        <auth-input
          v-model="verification_code"
          name="verification_code"
          placeholder="Verification code"
          :placeholder-need="true"
          type="number"
          maxlength="5"
        />
        <auth-button type="submit" :disabled="button_disabled">
          Confirm
        </auth-button>
      </form>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import store from "@/store";
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "./helpers";
import phone from "phone";
import { UserController } from "@/controllers";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class App extends Mixins(Helpers) {
  public step: number;
  public phone_number = "";
  public verification_code = "";

  get phone_number_error() {
    const { phone_number } = this;
    if (!phone_number.length) {
      return false;
    }

    if (!phone("+" + phone_number).length) {
      return "Phone error";
    }
  }

  get button_disabled() {
    if (this.step === 1) {
      const { phone_number } = this;
      const { phone_number_error } = this;

      const rule_1 = phone_number.length;
      const rule_2 = !phone_number_error;
      const allow = rule_1 && rule_2;

      return !allow;
    } else {
      const { verification_code } = this;

      const rule_1 = verification_code.length === 5;
      const allow = rule_1;

      return !allow;
    }
  }

  public onCreate() {
    this.step = 1;
    this.phone_number = UserController.phone.number || "";
    this.verification_code = "";
  }

  public async sendCode() {
    this.loading = true;
    const { phone_number } = this;
    try {
      await new ApiClient("auth").post(
        `resource/phones${
          UserController.phone.number &&
          UserController.phone.number === phone_number
            ? "/send_code"
            : ""
        }`,
        { phone_number: "+" + phone_number }
      );
      this.step++;
      helpers.runNotice("success", "Code was sent successfully");
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  public async verifyCode() {
    this.loading = true;
    const { phone_number, verification_code } = this;
    const payload = { phone_number, verification_code };
    try {
      await new ApiClient("auth").post("resource/phones/verify", payload);
      helpers.runNotice("success", "Phone was verified successfully");
      this.loading = false;
      this.delete();
    } catch (error) {
      this.loading = false;
      return error;
    }
  }
}
</script>
