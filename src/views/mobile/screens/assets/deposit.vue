<template>
  <panel-view class="screen-assets-deposit assets-deposit">
    <head-bar title="Deposit" @back="destroy" />

    <deposit-currency-picker :currency="currency" @click="open_search_screen" />
    <deposit-address-box
      :currency="currency"
      :deposit_address="deposit_address"
    />
    <deposit-notice :currency="currency" />
  </panel-view>
</template>

<script lang="ts">
import store from "@/store";
import ApiClient from "@zsmartex/z-apiclient";
import { ScreenMixin } from "@/mixins/mobile";
import { Mixins, Component } from "vue-property-decorator";
import { PublicController } from "@/controllers";

@Component({
  components: {
    "deposit-currency-picker": () =>
      import("@/layouts/mobile/screens/assets/deposit/currency-picker.vue"),
    "deposit-address-box": () =>
      import("@/layouts/mobile/screens/assets/deposit/address-box.vue"),
    "deposit-notice": () =>
      import("@/layouts/mobile/screens/assets/deposit/notice.vue")
  }
})
export default class DepositScreen extends Mixins(ScreenMixin) {
  loading = false;
  deposit_address = "NCJTG2MSZCS5KI4YJRLQATOKQNTC4NMUWQ5EBMXN";
  currency = PublicController.currencies[0];

  before_panel_create(currency: ZTypes.Currency) {
    this.currency = currency;
  }

  open_search_screen() {
    this.$router.push({ path: "/m/assets/search", query: { type: "deposit" } });
  }

  async get_deposit_address() {
    this.loading = true;
    try {
      const { data } = await new ApiClient("trade").get(
        `account/deposit_address/${this.currency.id}`
      );

      this.deposit_address =
        data.address || "NCJTG2MSZCS5KI4YJRLQATOKQNTC4NMUWQ5EBMXN";
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }
}
</script>

<style lang="less">
.assets-deposit {
  .head-bar {
    background-color: transparent;
  }

  &-currency {
    &-picker {
      position: relative;
      height: 32px;
      line-height: 32px;
      width: 100%;
      padding: 0 8px;
      background-color: var(--bg-card-color);
      font-weight: 500;

      > * {
        display: inline-block;
        vertical-align: top;
      }
    }

    &-logo {
      height: 32px;
      display: inline-block;
      margin-right: 8px;

      &-wrapper {
        height: 32px;
        vertical-align: middle;
        text-align: center;
        display: table-cell;
      }

      &-content {
        height: 24px;
        width: 24px;
        background-color: var(--border-color);
        border-radius: 24px;
        vertical-align: middle;
        text-align: center;
        display: table-cell;

        img {
          height: 16px;
          width: 16px;
          display: block;
          margin: 0 auto;
        }
      }
    }

    &-code {
      font-size: 12px;
      margin-right: 4px;
    }

    &-name {
      font-size: 8px;
      color: var(--color-gray);
      vertical-align: baseline;
    }

    &-action {
      position: absolute;
      right: 8px;
      font-size: 12px;
      color: var(--color-gray);
    }
  }

  &-address {
    &-box {
      padding: 12px 8px;
      margin-top: 8px;
      background-color: var(--bg-card-color);
    }

    &-title {
      font-size: 10px;
      font-weight: 500;
      color: var(--color-gray);
    }

    &-qrcode {
      margin: 12px 0;
      text-align: center;

      canvas {
        padding: 12px;
        background-color: #fff;
      }
    }

    &-value {
      margin-bottom: 12px;
      font-size: 12px;
      text-align: center;
      font-weight: 500;
    }

    &-action {
      text-align: center;

      button {
        color: var(--blue-color);
        font-size: 11px;
        font-weight: 500;
        height: 25px;
        border-radius: 2px;
        border: 1px solid;
        padding: 0 12px;
      }
    }
  }

  &-notice {
    padding: 8px;
    color: var(--color-gray);

    &-title {
    }

    &-content {
      margin-top: 8px;
    }

    &-item {
    }
  }
}
</style>
