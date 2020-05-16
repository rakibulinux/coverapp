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
              <a
                href="javascript:;"
                @click="amount = balance"
                v-text="balance"
              />
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
          <span class="form-tag" v-text="currencyObj.id.toUpperCase()" />
        </div>
      </div>
      <div class="form-row-container">
        <div class="form-row">
          <label class="form-label">{{ $t("assets.withdraw.fee") }}</label>
          <div class="form-control">
            <input
              type="text"
              disabled
              :value="Number(currencyObj.withdraw_fee).toFixed(8)"
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
              :value="
                Number((amount || 0) - currencyObj.withdraw_fee).toFixed(8)
              "
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="assets-2fa">
      {{ $t("message.withdraw.enable2fa") }}
      <button @click="onClick('2fa')" v-text="'ENABLE 2FA'" />
    </div>
    <div class="assets-action">
      <div class="assets-note">
        <h3 v-text="$t('assets.instructions')" />
        <i18n
          tag="p"
          class="desc"
          path="assets.withdraw.note"
          :places="{
            currency: currencyObj.id.toUpperCase(),
            min_withdraw_amount: currencyObj.min_withdraw_amount
          }"
        >
          <br />
        </i18n>
      </div>
      <div class="action">
        <button
          v-if="$store.state.user.otp"
          type="submit"
          :disabled="!address || amount <= 0 || amount > balance"
          @click="openTotp"
          v-text="$t('assets.withdraw.submit')"
        />
      </div>
    </div>
    <modal-totp
      ref="totp"
      :payload="payload_modal"
      :loading="loading"
      @onSubmit="onSubmitTotp"
      @onFailed="modalClose"
    />
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
    "modal-totp": _modal_totp
  },
  props: {
    balance: {
      type: String | Number,
      required: true
    },
    currencyObj: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    loading: false,
    address: "",
    amount: "",
    otp: "",
    payload_modal: {}
  }),
  watch: {
    amount() {
      this.amount = helpers.inputOnlyNumber(this.amount, 8);
    }
  },
  mounted() {
    if (!this.$store.state.user.otp)
      helpers.runMessage("warning", this.$t("message.withdraw.enable2fa"));
  },
  methods: {
    async withdraw() {
      const { rid, currency, amount, otp } = this;
      const payload = { rid, currency, amount, otp };

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
    onSubmitTotp(payload, totp_code) {
      this.otp = totp_code;
      this.withdraw();
    },
    modalClose() {
      this.payload_modal = {};
    },
    openTotp() {
      const modal = "totp";
      this.payload_modal = {
        modal
      };

      this.openModal(modal);
    },
    closeTotp() {
      this.closeModal("totp");
    },
    openModal(modal) {
      this.$nextTick(() => {
        this.$refs[modal].render();
      });
    },
    closeModal(modal) {
      this.$nextTick(() => {
        this.$refs[modal].remove();
      });
    }
  }
};
</script>
