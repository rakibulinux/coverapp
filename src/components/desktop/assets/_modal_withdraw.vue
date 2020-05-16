<template>
  <Modal
    v-model="modal.enabled"
    class-name="withdraw-modal"
    footer-hide
    width="400"
    @on-visible-change="onChangeShow()"
  >
    <img src="@/assets/img/Google_Authenticator.png" class="logo-modal" />
    <div class="desc">Enter the authentication code from the app below.</div>
    <form @submit.prevent="onWithdraw()">
      <auth-input
        ref="otp"
        v-model="otp"
        name="otp"
        :class-name="{ g: otp }"
        placeholder="2FA Code"
        :label-need="true"
        maxlength="6"
        type="number"
      />
      <button type="submit" :disabled="!(otp.length === 6)">
        <a-icon v-if="modal.loading_button" type="loading" style="font-size: 24px" spin />
        Confirm
      </button>
    </form>
  </Modal>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import AuthInput from "@/components/desktop/AuthInput.vue";

export default {
  props: {
    rid: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    amount: {
      type: String | Number,
      required: true
    }
  },
  data: () => ({
    otp: "",
    modal: {
      enabled: false,
      loading_button: false
    }
  }),
  methods: {
    render() {
      this.modal.enabled = true;
    },
    remove() {
      this.modal.enabled = false;
    },
    onChangeShow() {
      this.resetInput();
    },
    resetInput() {
      this.otp = "";
      this.$refs.otp.clear();
    },
    async onWithdraw() {
      this.modal.loading_button = true;
      const { rid, currency, amount, otp } = this;
      const payload = { rid, currency, amount, otp };
      try {
        await new ApiClient("trade").post("account/withdraws", payload);
        helpers.runNotice("success", this.$t("message.withdraw.success"));
        this.modal.loading_button = false;
        this.resetInput();
        this.remove();
      } catch (error) {
        this.modal.loading_button = false;
        this.resetInput();
        return error;
      }
    }
  },
  components: {
    "auth-input": AuthInput
  }
};
</script>
