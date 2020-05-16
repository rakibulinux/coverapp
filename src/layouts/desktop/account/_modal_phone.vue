<template>
  <a-modal
    v-model="modal.enabled"
    wrap-class-name="phone-modal"
    :footer="null"
    :width="400"
    @cancel="onChangeShow"
    @ok="onChangeShow"
  >
    <button
      v-show="step > 1"
      type="button"
      aria-label="Action"
      class="ant-modal-action"
      @click="step--"
    >
      <span class="ant-modal-action-x">
        <i class="ic-arrow-back" />
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
      <form v-if="$store.state.user.phone" @submit.prevent="sendCode">
        <div class="phone-number">
          <auth-input
            ref="phone_number"
            v-model="phone_number"
            name="phone_number"
            prefix="+"
            :class-name="{ g: true }"
            placeholder="Phone number"
            :label-need="true"
            :value="$store.state.user.phone.number"
          />
        </div>
        <button type="submit" :disabled="!phone_number">
          <a-icon
            v-if="modal.loading_button"
            type="loading"
            style="font-size: 24px"
            spin
          />
          Send Code
        </button>
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
          ref="verification_code"
          v-model="verification_code"
          name="verification_code"
          :class-name="{ g: verification_code }"
          placeholder="Verification code"
          maxlength="5"
          :label-need="true"
        />
        <button
          type="submit"
          :disabled="
            !(otp_code.length === 6) || !(verification_code.length === 5)
          "
        >
          <a-icon
            v-if="modal.loading_button"
            type="loading"
            style="font-size: 24px"
            spin
          />
          Confirm
        </button>
      </form>
    </div>
  </a-modal>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import AuthInput from "@/components/desktop/AuthInput.vue";
import Helpers from "./helpers";

export default {
  components: {
    "auth-input": AuthInput
  },
  mixins: [Helpers],
  data: () => ({
    step: 1,
    phone_number: "",
    verification_code: ""
  }),
  mounted() {
    this.phone_number = this.$store.state.user.phone.number;
  },
  methods: {
    resetInput() {
      this.phone_number = "";
      this.resetStep();
      if (!this.$store.state.user.otp) return;
    },
    onChangeShow() {
      if (!this.modal.enabled) {
        this.resetInput();
        this.step = 1;
      }
    },
    async sendCode() {
      this.modal.loading_button = true;
      const { phone_number } = this;
      try {
        await new ApiClient("auth").post(
          `resource/phones${
            this.$store.state.user.phone.number &&
            this.$store.state.user.phone.number === phone_number
              ? "/send_code"
              : ""
          }`,
          { phone_number: "+" + phone_number }
        );
        this.step++;
        helpers.runNotice("success", "Code was sent successfully");
        this.modal.loading_button = false;
      } catch (error) {
        this.modal.loading_button = false;
        return error;
      }
    },
    async verifyCode() {
      this.modal.loading_button = true;
      const { phone_number, verification_code } = this;
      let payload = { phone_number, verification_code };
      if (this.$store.state.user.otp) payload["otp_code"] = this.otp_code;
      try {
        await new ApiClient("auth").post("resource/phones/verify", payload);
        helpers.runNotice("success", "Phone was verified successfully");
        this.modal.loading_button = false;
      } catch (error) {
        this.modal.loading_button = false;
        return error;
      }
    }
  }
};
</script>
