<template>
  <a-modal
    v-model="modal.enabled"
    wrap-class-name="api-modal"
    :footer="null"
    :width="400"
    @cancel="onChangeShow"
    @ok="onChangeShow"
  >
    <need-security
      v-if="!$store.state.user.otp"
      @closeModal="closeModal"
      @changeModal="changeModal"
    />
    <div v-else-if="step === 1">
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        Create ApiKey
      </div>
      <div class="desc">
        Enter the authentication code from the app below.
      </div>
      <form @submit.prevent="createApi_Keys">
        <auth-input
          ref="totp_code"
          v-model="totp_code"
          name="totp_code"
          :value="totp_code"
          :class-name="{ g: totp_code }"
          placeholder="2FA Code"
          :label-need="true"
          maxlength="6"
          type="number"
        />
        <button type="submit" :disabled="!(totp_code.length === 6)">
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
    <div v-else>
      <div class="info-warning">
        <a-icon type="warning" />
        <p>
          <span>API Key Created</span>
          <br />This information will be shown only once and cannot be retrieved
          once lost. Please store it properly.
        </p>
      </div>
      <form @submit.prevent="remove">
        <auth-input
          ref="access_key"
          name="access_key"
          :value="value.kid"
          :class-name="{ g: value.kid }"
          placeholder="Access Key"
          maxlength="6"
          type="number"
          :label-need="true"
          :copy="true"
        />
        <auth-input
          ref="secret_key"
          name="secret_key"
          :value="value.secret.data.value"
          :class-name="{ g: value.secret.data.value }"
          placeholder="Secret Key"
          type="number"
          :label-need="true"
          :copy="true"
        />
        <button type="submit" v-text="$t('auth.confirm')" />
      </form>
    </div>
  </a-modal>
</template>

<script>
import AuthInput from "@/components/desktop/AuthInput.vue";
import Helpers from "./helpers";

export default {
  components: {
    "auth-input": AuthInput
  },
  mixins: [Helpers],
  data: () => ({
    totp_code: "",
    step: 1,
    value: {
      kid: "55",
      secret: {
        data: {
          value: ""
        }
      }
    }
  }),
  methods: {
    resetInput() {
      this.secret_key = this.access_key = this.totp_code = "";
      this.resetStep();
    },
    async createApi_Keys() {
      this.modal.loading_button = true;
      const algorithm = "HS256";
      const { totp_code } = this;
      try {
        const { kid, secret } = await this.$store.dispatch(
          "user/CREATE_API_KEYS",
          {
            algorithm,
            totp_code
          }
        ); // {"kid":"334cff30a7d5e171","algorithm":"HS256","scope":[],"state":"active","secret":"b698e0027d182311099ea42637bd890e","created_at":"2019-07-15T16:11:36Z","updated_at":"2019-07-15T16:11:36Z"}
        this.resetInput();
        this.modal.loading_button = false;
        this.value = { kid, secret };
        this.step++;
      } catch (error) {
        this.modal.loading_button = false;
        return error;
      }
    },
    onChangeShow() {
      this.resetInput();
    }
  }
};
</script>
