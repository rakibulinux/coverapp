<template>
  <transition name="panel-move">
    <panel-view
      v-if="isShowing"
      class="screen-personal-m security google-authenticator"
    >
      <head-bar :title="title" :loading="loading" @on-remove="back()" />
      <div class="body-bar">
        <div v-if="STEP_NEXT.includes(step)" class="note">
          <div v-if="step === 1">
            <div class="icon">
              <img
                src="@/assets/img/Google_Authenticator.png"
                width="100%"
                height="100%"
                alt=""
              />
            </div>
            <div class="content">
              To begin, you will need to install the
              <a href="#">Google Authenticator</a> application on your phone.
            </div>
          </div>
          <div v-else-if="step === 2">
            <div class="icon qrcode">
              <qrcode :value="code.url" :size="90" level="L" />
            </div>
            <div class="content">
              <div>
                Please save thí key on paper. This key will allow you to recover
                your Google Authenticator in case of phone loss.
              </div>
              <div class="key">
                <span>{{ code.secret }}</span>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="content">
              <div>Please enter the 16-digit key you just backed up.</div>
              <input-setting
                v-model="confirm_code"
                class="input"
                maxlength="16"
              />
            </div>
          </div>
        </div>
        <div v-if="step === 4" class="setup-google-authenticator-box">
          <input-setting
            v-model="otp_code"
            type="number"
            maxlength="6"
            placeholder="OTP Code"
          />

          <input-setting v-model="password" placeholder="Login Password" />
        </div>
        <div class="action">
          <button type="submit" :disabled="buttonDisabled" @click="next">
            {{ getActionText }}
          </button>
        </div>
      </div>
    </panel-view>
  </transition>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import qrcode from "@/components/desktop/qrcode";
import Helpers from "../../helpers";

export default {
  components: {
    qrcode
  },
  mixins: [Helpers],
  data: () => ({
    loading: false,
    STEP_NEXT: [1, 2, 3],
    STEP_SUBMIT: [4],
    step: 1,
    code: {
      secret: "",
      url: ""
    },
    confirm_code: "",
    otp_code: ""
  }),
  computed: {
    title() {
      const { step } = this;
      var title = "";
      if (step === 1) title = "Download and install";
      else if (step === 2) title = "Backup Key";
      else if (step === 3) title = "Enter 16-Digit key";
      else if (step === 4) title = "Google Authenticator";
      return title;
    },
    getActionText() {
      if (this.STEP_NEXT.includes(this.step)) return "Next";
      else return "Submit";
    },
    buttonDisabled() {
      var allow = true;
      if (this.step === 3) {
        allow = this.confirm_code === this.code.secret;
      }

      return !allow;
    }
  },
  methods: {
    back() {
      if (this.step === 1) this.remove();
      else this.step--;
    },
    next() {
      if (this.step === 4) return this.enable2FA();
      this.step++;
    },
    onRender() {
      if (!this.code.secret) this.getQRCode();
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
    async enable2FA() {
      this.loading = true;
      const { password, otp_code } = this;
      try {
        await new ApiClient("auth").post("resource/otp/enable", {
          password,
          otp_code
        });
        this.loading = false;
        this.$store.commit("user/ENABLE_OTP");
        this.remove();
      } catch (error) {
        this.loading = false;
        return error;
      }
    }
  }
};
</script>
