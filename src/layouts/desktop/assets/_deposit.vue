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
          <a @click="copy_address" v-text="$t('assets.deposit.copy')" />
          <a
            v-click-outside:mousedown.capture="show_qr_code"
            v-click-outside.capture="show_qr_code"
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
        v-if="currency.type === 'coin'"
        class="block-address"
        :href="currency.explorer_address.replace('#{address}', depositAddress)"
        target="_blank"
      >
        Block Browser
      </a>
    </div>
    <div class="assets-note">
      <h3 v-text="$t('assets.instructions')" />
      <fix-i18n
        tag="p"
        class="desc"
        path="assets.deposit.note"
        :places="{
          currency: currency.id.toUpperCase(),
          min_deposit_amount: currency.min_deposit_amount,
          min_confirmations: currency.min_confirmations
        }"
      >
        <br />
      </fix-i18n>

    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";

@Component({
  components: {
    qrcode: () => import("@/components/desktop/qrcode"),
  },
})
export default class DepositBox extends Vue {
  @Prop() public readonly depositAddress!: string;
  @Prop() public readonly currency!: ZTypes.Currency;

  public qrcode_show = false;

  public copy_address() {
    helpers.copyText(this.depositAddress);
  }

  public show_qr_code() {
    this.qrcode_show = false;
  }
}
</script>
