<template>
  <transition name="panel-move">
    <panel-view v-if="isShowing" class="screen-personal-m security">
      <head-bar title="SMS Authenticator" @on-remove="remove()" />
      <div class="body-bar">
        <div class="sms-authenticator-box">
          <input-completer
            v-model="phone_number"
            label="Phone Number"
            prefix="+"
            placeholder="Enter your phone number"
          >
            <!-- TODO: Add support completer for phone country codes  -->
          </input-completer>
          <input-completer
            v-model="verification_code"
            label="SMS authenticator code:"
            placeholder="Enter your verification code"
            maxlength="5"
            type="number"
          >
            <template v-slot:right>
              <span @click="sendSMS">
                {{ wait === 0 ? "Send SMS" : wait + "s" }}
              </span>
            </template>
          </input-completer>
        </div>
        <div class="action">
          <button :disabled="buttonDisabled" @click="verifyCode">
            Confirm
          </button>
        </div>
      </div>
    </panel-view>
  </transition>
</template>

<script>
import ApiClient from "@zsmartex/z-apiclient";
import phone from "phone"; //TODO: add support for vaile phone number
import Helpers from "../../helpers";

export default {
  mixins: [Helpers],
  data: () => ({
    phone_number: "",
    verification_code: "",
    wait: 0,
    waitInterval: null
  }),
  computed: {
    vaildPhone() {
      return phone("+" + this.phone_number).length;
    },
    vaildCode() {
      return this.verification_code.length === 5;
    },
    buttonDisabled() {
      return !(this.vaildPhone && this.vaildCode);
    }
  },
  methods: {
    onRender() {
      this.phone_number = this.$store.state.user.phone.number;
    },
    actionReSend() {
      this.wait = 60;
      setTimeout(() => {
        clearInterval(this.waitInterval);
        this.wait = 0;
      }, 60000);
      this.waitInterval = setInterval(() => {
        this.wait--;
      }, 1000);
    },
    async sendSMS() {
      this.loading = true;

      const { phone_number } = this;
      try {
        await new ApiClient("auth").post(
          `resource/phones${
            this.$store.state.user.phone.number &&
            this.$store.state.user.phone.number === phone_number
              ? "/send_code"
              : ""
          }`,
          { phone_number }
        );
        this.actionReSend();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        return error;
      }
    },
    async verifyCode() {
      this.loading = true;

      const { phone_number, verification_code } = this;
      const payload = { phone_number, verification_code };
      try {
        await new ApiClient("auth").post("resource/phones/verify", payload);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        return error;
      }
    }
  }
};
</script>
