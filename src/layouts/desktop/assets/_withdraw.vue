<template>
  <div class="assets-withdraw">
    <div v-if="$store.state.user.otp" class="assets-form">
      <div class="form-row">
        <label class="form-label">{{ $t("assets.address") }}</label>
        <div class="form-control">
          <input v-model="address" type="text" autocomplete="off" />
        </div>
      </div>
      <div class="form-row">
        <label class="form-label">
          {{ $t("assets.withdraw.amount") }}
          <p class="label-right">
            <span>
              {{ $t("assets.withdraw.available") }}
              <a @click="place_all_available" v-text="available" />
            </span>
          </p>
        </label>
        <div class="form-control">
          <input
            v-model="amount"
            type="text"
            autocomplete="off"
            maxlength="16"
          />
          <span class="form-tag" v-text="currency.id.toUpperCase()" />
        </div>
      </div>
      <div class="form-row-container">
        <div class="form-row">
          <label class="form-label">{{ $t("assets.withdraw.fee") }}</label>
          <div class="form-control">
            <input
              type="text"
              disabled
              :value="Number(currency.withdraw_fee).toFixed(8)"
            />
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">
            {{ $t("assets.withdraw.receive_amount") }}
          </label>
          <div class="form-control">
            <input
              type="text"
              disabled
              :value="Number((amount || 0) - currency.withdraw_fee).toFixed(8)"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="assets-2fa">
      {{ $t("message.withdraw.enable2fa") }}
      <button @click="openModal('2fa')" v-text="'ENABLE 2FA'" />
    </div>
    <div class="assets-action">
      <div class="assets-note">
        <h3 v-text="$t('assets.instructions')" />
        <fix-i18n
          tag="p"
          class="desc"
          path="assets.withdraw.note"
          :places="{
            currency: currency.id.toUpperCase(),
            min_withdraw_amount: currency.min_withdraw_amount
          }"
        >
          <br />
        </fix-i18n>
      </div>
      <div class="action">
        <button
          v-if="$store.state.user.otp"
          type="submit"
          :disabled="button_disabled"
          @click="openTotp"
          v-text="$t('assets.withdraw.submit')"
        />
      </div>
    </div>
    <modal-totp ref="totp" :loading="loading" @submit="onSubmitTotp" />
    <modal-2fa ref="2fa" />
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import _modal_2fa from "@/layouts/desktop/account/_modal_2fa.vue";
import _modal_totp from "@/layouts/desktop/modal/_modal_totp";

export default {
  components: {
    "modal-2fa": _modal_2fa,
    "modal-totp": _modal_totp,
  },
  props: {
    available: String,
    currency: Object,
  },
  computed: {
    button_disabled() {
      const { address } = this;
      const amount = Number(this.amount);
      const available = Number(this.available);

      return !address || amount <= 0 || amount > available;
    },
  },
  data: () => ({
    loading: false,
    address: "",
    amount: "",
    otp_code: "",
  }),
  watch: {
    amount() {
      this.amount = helpers.inputOnlyNumber(this.amount, 8);
    },
  },
  mounted() {
    if (!this.$store.state.user.otp)
      helpers.runMessage("warning", this.$t("message.withdraw.enable2fa"));
  },
  methods: {
    place_all_available() {
      this.amount = this.available;
    },
    async withdraw() {
      const { rid, currency, amount, otp_code } = this;
      const payload = { rid, currency, amount, otp: otp_code };

      this.loading = true;
      try {
        await new ApiClient("trade").post("account/withdraws", payload);
        helpers.runNotice("success", this.$t("message.withdraw.success"));
        this.loading = false;
        this.closeTotp();
      } catch (error) {
        this.loading = false;
        return error;
      }
    },
    onSubmitTotp(otp_code) {
      this.otp_code = otp_code;
      this.withdraw();
    },
    openTotp() {
      const modal = "totp";

      this.openModal(modal);
    },
    closeTotp() {
      this.closeModal("totp");
    },
    openModal(modal) {
      this.$refs[modal].create();
    },
    closeModal(modal) {
      this.$refs[modal].delete();
    },
  },
};
</script>
