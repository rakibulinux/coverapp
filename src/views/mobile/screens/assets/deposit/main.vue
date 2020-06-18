<template>
  <panel-view v-if="isShowing" class="screen-assets-m deposit">
    <head-bar title="Deposit" @on-remove="remove()" />
    <div class="body-bar">
      <div class="information-deposit-address">
        <div class="qrcode">
          <div class="qrcontent"></div>
        </div>
        <div class="warning text-down">
          Do not deposit via ETH contact transfer, otherwise your assets will be
          lost!
        </div>
        <div class="deposit-address">
          <span class="address">
            {{ deposit_address || null }}
          </span>
          <span class="action" @click="copyAddress">Copy</span>
        </div>
      </div>
      <div class="note">
        <p>
          - Do not deposit any other currencies in the address that they are not
          blonged to, or it cannot be refunded.
        </p>
        <p>
          - After deposit, you can go to historical page to check the
          deposit-arrival process. Historical record
        </p>
        <p>
          - Please ensure your computer and browser are secure in case of
          information leakage or tampering.
        </p>
      </div>
    </div>
  </panel-view>
</template>

<script>
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "../helpers";

export default {
  mixins: [Helpers],
  data: () => ({
    deposit_address: null
  }),
  computed: {},
  methods: {
    copyAddress() {
      helpers.copyText(this.deposit_address);
    },
    async getDepositAddress() {
      try {
        const { data } = await new ApiClient("trade").get(
          `account/deposit_address/${this.currency}`
        );
        this.deposit_address = data.address;
      } catch (error) {
        return error;
      }
    },
    onRender() {
      this.getDepositAddress();
    }
  }
};
</script>
