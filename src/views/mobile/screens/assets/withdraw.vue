<template>
  <panel-view class="screen-assets screen-assets-withdraw">
    <head-bar
      :title="`Withdraw ${currency.id.toUpperCase()}`"
      @back="destroy"
    />

    <currency-picker
      :currency="currency"
      @click="open_currency_picker_screen"
    />

    <div class="screen-assets-withdraw-box">
      <assets-input
        v-model="address"
        title="Address"
        placeholder="Please paste the address here"
      />

      <assets-input
        v-model="amount"
        title="Amount"
        :note="`Available: ${available} ${currency.id.toUpperCase()}`"
      >
        <template slot="action">
          <span class="currency-name">{{ currency.id.toUpperCase() }}</span>
          <a class="max" @click="amount = available">Max</a>
        </template>
      </assets-input>
    </div>

    <div class="screen-assets-notice">
      <div class="screen-assets-notice-title">Notice:</div>
      <div class="screen-assets-notice-content">
        • Do not withdraw directly to a cowdfund or ICO. We will not credit your
        account with tokens from that sale.
        <br />
        • Once you have to submitted your withdrawal request, we will send a
        confirmation email.
      </div>
    </div>

    <div class="screen-assets-withdraw-tab-bar">
      <div class="screen-assets-withdraw-tab-bar-note">
        You will get:
        <br />
        <span class="value">
          {{ amount || "0.0" }} {{ currency.id.toUpperCase() }}
        </span>
        <br />
        Transaction Fee {{ this.currency.withdraw_fee }}
        {{ currency.id.toUpperCase() }}
      </div>
      <button
        class="screen-assets-withdraw-tab-bar-button"
        :disabled="!address || !amount || available < Number(amount)"
        @click="submit_withdrawal()"
      >
        Withdrawal
      </button>
    </div>

    <screen-verify-otp
      ref="screen-verify-otp"
      :loading="loading"
      @submit="submit_withdrawal"
      @cancel="close_verify_otp_screen"
    />
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins, Watch } from "vue-property-decorator";
import { PublicController, TradeController } from "@/controllers";
import * as helpers from "@zsmartex/z-helpers";

@Component({
  components: {
    "currency-picker": () =>
      import("@/layouts/mobile/screens/assets/deposit/currency-picker.vue"),
    "assets-input": () => import("@/layouts/mobile/assets/assets-input.vue"),
    "screen-verify-otp": () => import("@/views/mobile/screens/verify/totp.vue")
  }
})
export default class AssetsWithdrawScreen extends Mixins(ScreenMixin) {
  loading = false;
  currency = PublicController.currencies[0];
  address = "";
  amount = "";

  $refs: {
    [key: string]: ScreenMixin;
  }

  get assets() {
    return new helpers.Balance(this.currency.id);
  }

  get available() {
    return this.assets.available;
  }

  before_panel_create(currency: ZTypes.Currency) {
    this.currency = currency;
  }

  open_currency_picker_screen() {
    (this.$parent as any).open_assets_currency_picker_screen("withdraw");
  }

  open_verify_otp_screen() {
    this.$refs["screen-verify-otp"].create();
  }

  close_verify_otp_screen() {
    this.$refs["screen-verify-otp"].destroy();
  }

  async submit_withdrawal(otp_code?: string) {
    if (!otp_code) {
      this.open_verify_otp_screen();

      return;
    }

    this.loading = true;

    await TradeController.create_withdrawal(
      this.currency.id,
      this.address,
      Number(this.amount),
      otp_code,
      () => {
        this.close_verify_otp_screen();
      }
    );

    this.loading = false;
  }

  @Watch("amount")
  onAmountChanged(amount: string) {
    this.amount = helpers.inputOnlyNumber(amount, 8);
  }
}
</script>

<style lang="less">
.screen-assets-withdraw {
  &-box {
    margin: 0 8px;

    .z-auth-input {
      margin-top: 12px;
    }

    .currency-name {
      color: var(--color-gray);
      margin-right: 4px;
    }

    .max {
      font-weight: 500;
    }
  }

  .screen-assets-notice {
    margin-top: 16px;
  }

  &-tab-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border-color);
    padding: 8px 12px;

    &-note {
      color: var(--color-gray);
      line-height: 1;
      font-size: 9px;
      .value {
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.5;
      }
    }

    &-button {
      height: 25px;
      line-height: 25px;
      padding: 0 8px;
      background-color: var(--blue-color);
      font-size: 12px;
      font-weight: 500;
      border-radius: 2px;

      &:disabled {
        background-color: var(--disabled-color);
        cursor: not-allowed;
      }
    }
  }
}
</style>
