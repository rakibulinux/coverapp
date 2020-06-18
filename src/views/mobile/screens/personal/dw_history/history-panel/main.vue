<template>
  <panel-view v-if="isShowing" class="screen-personal-m dw-history-panel">
    <head-bar :title="title" @on-remove="remove()" />
    <div class="body-bar">
      <div class="information-history">
        <div class="name"></div>
        <div class="value">
          <div class="">
            <p class="amount">
              <span class="text-left name">Amount</span>
              <span class="text-right value">{{ amount }}</span>
            </p>
            <p :class="['status', status]">
              <span class="text-left name">Status</span>
              <span class="text-right value">
                {{ $t(`assets.history.state.${status}`, statusText) }}
              </span>
            </p>
          </div>
          <div class="">
            <p class="address">
              <span class="text-left name">Address</span>
              <span class="text-right value">{{ address }}</span>
            </p>
            <p class="txid">
              <span class="text-left name">Txid</span>
              <span class="text-right value">{{ txid }}</span>
            </p>
            <p class="date">
              <span class="text-left name">Date</span>
              <span class="text-right value">{{ date }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="action">
        <button class="copy-txid" @click="copyTxid">
          Copy Txid
        </button>
        <button class="explorer-link">
          Check Explorer
        </button>
      </div>
    </div>
  </panel-view>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "../../helpers";

export default {
  mixins: [Helpers],
  props: {
    type: String,
    data: Object
  },
  computed: {
    title() {
      const { type } = this;

      return type === "deposits" ? "Deposit Detail" : "Withdrawal Detail";
    },
    amount() {
      return this.data.amount;
    },
    status() {
      const { state } = this.data;
      const doneValue = ["accepted", "skipped", "collected", "succeed"];
      const waitValue = ["submitted", "confirming"];
      if (doneValue.includes(state)) return "completed";
      else if (waitValue.includes(state)) return "processing";
      else return "failed";
    },
    statusText() {
      const { confirmations, min_confirmations } = this;

      if (this.status === "processing") {
        return {
          confirmations,
          min_confirmations
        };
      } else return {};
    },
    address() {
      return this.data.address || this.data.rid;
    },
    txid() {
      return this.data.txid || this.data.blockchain_txid;
    },
    date() {
      return helpers.getDate(this.data.created_at, true);
    },
    confirmations() {
      return this.data.confirmations;
    },
    min_confirmations() {
      return new helpers.Currency(this.data.currency).get().min_confirmations;
    }
  },
  methods: {
    copyTxid() {
      const { txid } = this;
      helpers.copyText(txid);
    }
  }
};
</script>
