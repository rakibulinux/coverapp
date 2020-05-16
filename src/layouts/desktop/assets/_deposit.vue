<template>
  <div class="assets-deposit">
    <div class="assets-form">
      <div class="address-box">
        <label
          class="address-label"
          v-text="$t('assets.deposit.deposit_address')"
        />
        <div class="address-form">
          <input type="text" :value="depositAddress" readonly />
          <a @click="copyAddress()" v-text="$t('assets.deposit.copy')" />
          <a
            v-click-outside:mousedown.capture="showQRCode"
            v-click-outside.capture="showQRCode"
            @click="qrcode_show = true"
          >
            <span v-text="$t('assets.deposit.qr_code')" />
            <div class="show-qrcode" :class="{ active: qrcode_show }">
              <qrcode
                :value="depositAddress"
                :size="110"
                level="L"
                background="transparent"
              />
            </div>
          </a>
        </div>
      </div>
      <a
        v-if="currencyObj.type === 'coin'"
        class="block-address"
        :href="
          currencyObj.explorer_address.replace('#{address}', depositAddress)
        "
        target="_blank"
        >
        Block Browser
      </a>
    </div>
    <div class="assets-note">
      <h3 v-text="$t('assets.instructions')" />
      <i18n
        tag="p"
        class="desc"
        path="assets.deposit.note"
        :places="{
          currency: currencyObj.id.toUpperCase(),
          min_deposit_amount: currencyObj.min_deposit_amount,
          min_confirmations: currencyObj.min_confirmations
        }"
      >
        <br />
      </i18n>
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import qrcode from "@/components/desktop/qrcode";

export default {
  components: {
    qrcode
  },
  props: {
    depositAddress: String,
    currencyObj: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    qrcode_show: false
  }),
  methods: {
    copyAddress() {
      helpers.copyText(this.depositAddress);
    },
    showQRCode() {
      this.qrcode_show = false;
    }
  }
};
</script>
