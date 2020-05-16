<template>
  <a-modal
    v-model="modal.enabled"
    wrap-class-name="2fa-modal"
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
      <span class="ant-modal-action-x"><i class="ic-arrow-back"/></span>
    </button>
    <img src="@/assets/img/Google_Authenticator.png" class="logo-modal" />
    <div v-if="step === 1" class="step">
      <div
        class="desc"
        v-text="translation(`modal_2fa[${step.toString()}].desc`)"
      />
    </div>
    <div v-else-if="step === 2" class="step">
      <div
        class="title"
        v-text="translation(`modal_2fa[${step.toString()}].title`)"
      />
      <div class="box">
        <qrcode :value="code.url" :size="110" level="L" />
        <div class="info-qr">
          <p
            class="info"
            v-text="translation(`modal_2fa[${step.toString()}].info`)"
          />
          <p class="secret">
            {{ translation(`modal_2fa[${step}].key`) }}: {{ code.secret }}
          </p>
        </div>
      </div>
    </div>
    <div v-else-if="step === 3" class="step">
      <div
        class="title"
        v-text="translation(`modal_2fa[${step.toString()}].title`)"
      />
      <div
        class="desc"
        v-text="translation(`modal_2fa[${step.toString()}].desc`)"
      />
      <form @submit.prevent="enable2FA">
        <auth-input
          ref="password"
          v-model="password"
          name="password"
          type="password"
          :value="password"
          :class-name="{ g: password }"
          :placeholder="$t('placeholder.password')"
          :label-need="true"
        />
        <auth-input
          ref="otp_code"
          v-model="otp_code"
          name="otp_code"
          :value="otp_code"
          :class-name="{ g: otp_code }"
          :placeholder="$t('placeholder.2fa_code')"
          :label-need="true"
        />
        <button type="submit" :disabled="!(otp_code.length === 6)">
          <a-icon
            v-if="modal.loading_button"
            type="loading"
            style="font-size: 24px"
            spin
          />
          {{ $t("auth.confirm") }}
        </button>
      </form>
    </div>
    <button v-if="step < 3" @click="step++" v-text="translation('next')" />
    <div v-if="step === 2" class="later-footer">
      <span @click="modal.enabled = false" v-text="translation('later')" />
    </div>
  </a-modal>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import AuthInput from "@/components/desktop/AuthInput.vue";
import qrcode from "@/components/desktop/qrcode";
import Helpers from "./helpers";

export default {
  components: {
    qrcode,
    "auth-input": AuthInput
  },
  mixins: [Helpers],
  data: () => ({
    step: 1,
    otp_code: "",
    password: "",
    code: {
      secret: "",
      url: ""
    }
  }),
  methods: {
    onRender() {
      if (!this.code.secret) this.getQRCode();
    },
    resetInput() {
      this.password = "";
      this.otp_code = "";
      this.resetStep();
    },
    async getQRCode() {
      try {
        const { data } = await new ApiClient("auth").post(
          "resource/otp/generate_qrcode"
        );
        let url = data.data.url;
        url = helpers.removeURLParam(url, "algorithm");
        url = helpers.removeURLParam(url, "digits");
        this.code = {
          secret: helpers.getURLParam(url, "secret"),
          url
        };
      } catch (error) {
        return error;
      }
    },
    onChangeShow() {
      this.resetInput();
    },
    async enable2FA() {
      this.modal.loading_button = true;
      const { password, otp_code } = this;
      try {
        await new ApiClient("auth").post("resource/otp/enable", {
          password,
          otp_code
        });
        this.modal.loading_button = this.modal.enabled = false;
        this.$store.commit("user/ENABLE_OTP");
      } catch ({ response }) {
        this.modal.loading_button = false;
        const message = response.data.errors[0].replace("resource.otp.", "");
        if (message === "password_not_correct")
          this.$refs.password.addError(message);
        else if (message === "otp_invalid")
          this.$refs.otp_code.addError(message);
      }
    }
  }
};
</script>
