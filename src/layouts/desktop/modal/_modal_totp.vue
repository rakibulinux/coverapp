<template>
  <a-modal
    v-model="modal.enabled"
    wrap-class-name="totp-modal"
    :footer="null"
    :width="400"
    @cancel="onChangeShow"
    @ok="onChangeShow"
  >
    <div>
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        Update ApiKey
      </div>
      <div class="desc">
        Enter the authentication code from the app below.
      </div>
      <form @submit.prevent="sendData">
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
        <button type="submit" :disabled="valid2FA || !loading">
          <a-icon v-if="loading" type="loading" style="font-size: 24px" spin />
          {{ $t("auth.confirm") }}
        </button>
      </form>
    </div>
  </a-modal>
</template>

<script>
import AuthInput from "@/components/desktop/AuthInput.vue";

export default {
  components: {
    "auth-input": AuthInput
  },
  props: {
    payload: {
      type: Object,
      required: false,
      default: () => ({})
    },
    loading: Boolean
  },
  data: () => ({
    sentData: false,
    totp_code: "",
    modal: {
      enabled: false
    }
  }),
  computed: {
    valid2FA() {
      return !(this.totp_code.length === 6);
    }
  },
  watch: {
    totp_code() {
      if (this.totp_code.length === 6) {
        this.sendData();
      }
    }
  },
  methods: {
    render() {
      this.modal.enabled = true;
    },
    remove() {
      this.modal.enabled = false;
    },
    sendData() {
      this.sentData = true;
      this.$emit("onSubmit", this.payload, this.totp_code);
    },
    onChangeShow() {
      this.resetInput();
      if (!this.sentData) this.$emit("onFailed");
    },
    resetInput() {
      this.totp_code = "";
      this.$refs.totp_code.clear();
      this.sentData = false;
    }
  }
};
</script>
