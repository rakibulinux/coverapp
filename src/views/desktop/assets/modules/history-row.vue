<template>
  <dl :class="{ selected: txid_box_opening }">
    <span
      :class="[
        'status',
        {
          loading: ['processing', 'confirming'].includes(record.state),
          error: ['errored', 'rejected', 'failed', 'to_reject'].includes(
            record.state
          ),
          success: ['succeed', 'completed', 'accepted'].includes(record.state)
        }
      ]"
    >
      {{ $t(`assets.history.state.${record.state}`) }}
      <span v-if="record.state == 'processing' || record.state == 'confirming'">
        ({{ record.confirmations }}/{{ currency.min_confirmations }})
      </span>
    </span>
    <span class="coin" v-text="record.currency.toUpperCase()" />
    <span class="amount" v-text="Number(record.amount).toFixed(8)" />
    <span class="date" v-text="getDate(record.created_at)" />
    <span class="infomation">
      <div class="address">
        <span class="title">{{ $t("assets.address") }}:</span>
        <a
          v-if="txid_box_opening"
          :href="currency.explorer_address.replace('#{address}', record.rid)"
          target="_blank"
          v-text="record.rid"
        />
        <span v-else v-text="record.rid" />
      </div>
      <div class="txid" :class="[txid_box_opening ? 'show' : 'hide']">
        <span class="title">{{ $t("assets.txid") }}:</span>
        <a
          :href="
            currency.explorer_transaction.replace(
              '#{txid}',
              record.blockchain_txid
            )
          "
          target="_blank"
          v-text="record.blockchain_txid"
        />
      </div>
    </span>
    <span class="action text-right">
      <i
        v-if="type == 'deposit'"
        class="zicon-arrow-down"
        @click="change_txid_box"
      />
      <i
        v-if="record.state != 'prepared' && type == 'withdraw'"
        class="zicon-arrow-down"
        @click="change_txid_box"
      />
      <template v-if="record.state == 'prepared' && type == 'withdraw'">
        <a-icon type="close" @click="cancel_withdrawal()" />
      </template>
    </span>

    <modal-totp
      ref="totp"
      :loading="cancel_loading"
      @submit="cancel_withdrawal"
    />
  </dl>
</template>

<script lang="ts">
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import { PublicController } from "@/controllers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "modal-totp": () => import("@/layouts/desktop/modal/_modal_totp.vue")
  }
})
export default class AssetsHistoryRow extends Vue {
  @Prop() readonly record!: ZTypes.Withdraw | ZTypes.Deposit;
  @Prop() readonly type!: "deposit" | "withdraw";

  cancel_loading = false;
  txid_box_opening = false;

  get currency() {
    return PublicController.currencies.find(
      currency => currency.id == this.record.currency
    );
  }

  mounted() {
    ZSmartModel.on("open-txid-box", () => {
      this.close_txid_box();
    });
  }

  beforeDestroy() {
    ZSmartModel.remove("open-txid-box", () => {
      this.close_txid_box();
    });
  }

  getDate(date) {
    return helpers.getDate(date, true);
  }

  open_txid_box() {
    ZSmartModel.emit("open-txid-box");
    this.$nextTick(() => {
      this.txid_box_opening = true;
    });
  }

  close_txid_box() {
    this.txid_box_opening = false;
  }

  change_txid_box() {
    this.txid_box_opening ? this.close_txid_box() : this.open_txid_box();
  }

  open_confirm_modal() {
    (this.$parent.$refs["modal-confirm-withdrawal"] as any).create(this.record);
  }

  async cancel_withdrawal(otp_code?: string) {
    if (!otp_code) {
      (this.$refs["totp"] as any).create();
      return;
    }

    this.cancel_loading = true;

    await this.TradeController.cancel_withdrawal(
      this.record.tid,
      otp_code,
      () => {
        (this.$refs["totp"] as any).delete();

        const withdraws: ZTypes.Withdraw[] = (this.$parent as any).history.data;

        const index = withdraws.findIndex(
          withdraw => withdraw.tid == this.record.tid
        );

        if (index >= 0) {
          const withdraw = withdraws[index];
          withdraw.state = "canceled";

          withdraws[index] = withdraw;
        }
      }
    );

    this.cancel_loading = false;
  }
}
</script>
