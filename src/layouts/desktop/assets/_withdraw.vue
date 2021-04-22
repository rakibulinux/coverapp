<template>
  <div class="assets-withdraw">
    <div v-if="UserController.otp" class="assets-form">
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
              <a @click="amount = available.toString()" v-text="available" />
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
      <button @click="open_modal('2fa')" v-text="'ENABLE 2FA'" />
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
          v-if="UserController.otp"
          type="submit"
          :disabled="button_disabled"
          @click="withdraw()"
          v-text="$t('assets.withdraw.submit')"
        />
      </div>
    </div>
    <modal-totp ref="totp" :loading="loading" @submit="withdraw" />
    <modal-2fa ref="2fa" />
    <modal-confirm-withdrawal ref="modal-confirm-withdrawal" />
  </div>
</template>

<script lang="ts">
import { runNotice } from "@/mixins";
import * as helpers from "@zsmartex/z-helpers";
import _modal_2fa from "@/layouts/desktop/account/_modal_2fa.vue";
import _modal_totp from "@/layouts/desktop/modal/_modal_totp.vue";
import _modal_confirm_withdrawal from "@/layouts/desktop/modal/modal-confirm-withdrawal.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {
    "modal-2fa": _modal_2fa,
    "modal-totp": _modal_totp,
    "modal-confirm-withdrawal": _modal_confirm_withdrawal
  }
})
export default class AssetsWithdraw extends Vue {
  $refs!: {
    "modal-2fa": _modal_2fa;
    "modal-totp": _modal_totp;
  };

  @Prop() readonly available!: number;
  @Prop() readonly currency!: ZTypes.Currency;

  loading = false;
  address = "";
  amount = "";

  get button_disabled() {
    const { address } = this;
    const amount = Number(this.amount);
    const available = Number(this.available);

    return !address || amount <= 0 || amount > available;
  }

  mounted() {
    if (!this.UserController.otp)
      runNotice("warning", this.$t("message.withdraw.enable2fa"));
  }

  async withdraw(otp_code?: string) {
    if (!otp_code) return this.open_modal("totp");

    this.loading = true;

    await this.TradeController.create_withdrawal(
      this.currency.id,
      this.address,
      Number(this.amount),
      otp_code,
      withdraw => {
        this.close_modal("totp");

        this.open_modal("modal-confirm-withdrawal", withdraw);
      }
    );
    this.loading = false;
  }

  open_modal(modal: string, payload?: any) {
    this.$refs[modal].create(payload);
  }

  close_modal(modal: string) {
    this.$refs[modal].delete();
  }

  @Watch("amount")
  onAmountChanged(amount: string) {
    this.amount = helpers.inputOnlyNumber(amount, 8);
  }
}
</script>

<style lang="less">
.assets-withdraw {
  padding: 20px 0;
}
</style>
