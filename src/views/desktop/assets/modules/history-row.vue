<template>
  <dl :class="{ selected: showBox }">
    <span
      v-if="checkCompleted(data.state) === 'done'"
      class="status"
      v-text="$t('assets.history.state.completed')"
    />
    <span
      v-else-if="checkCompleted(data.state) === 'wait'"
      class="status loading"
    >
      {{
        $t("assets.history.state.processing", {
          confirmations: data.confirmations,
          min_confirmations: currencyArray(data.currency).min_confirmations
        })
      }}
    </span>
    <span v-else class="status">Failed</span>
    <span class="coin" v-text="data.currency.toUpperCase()" />
    <span class="amount" v-text="Number(data.amount).toFixed(8)" />
    <span class="date" v-text="getDate(data.created_at)" />
    <span class="infomation">
      <div class="address">
        <span class="title">{{ $t("assets.address") }}:</span>
        <a
          v-if="showBox"
          :href="
            currencyArray(data.currency).explorer_address.replace(
              '#{address}',
              data.address
            )
          "
          target="_blank"
          v-text="data.address"
        />
        <span v-else v-text="data.address" />
      </div>
      <div class="txid" :class="[showBox ? 'show' : 'hide']">
        <span class="title">{{ $t("assets.txid") }}:</span>
        <a
          :href="
            currencyArray(data.currency).explorer_transaction.replace(
              '#{txid}',
              data.txid
            )
          "
          target="_blank"
          v-text="data.txid"
        />
      </div>
    </span>
    <span class="action text-right">
      <i class="zicon-arrow-down" @click="changeBox" />
    </span>
  </dl>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import { PublicController } from "@/controllers";

export default {
  props: {
    data: Object
  },
  data: () => ({
    showBox: false
  }),
  mounted() {
    ZSmartModel.on("open-box", this.closeBox);
  },
  methods: {
    getDate: date => helpers.getDate(date, true),
    checkCompleted(state) {
      const doneValue = ["accepted", "skipped", "collected", "succeed"];
      const waitValue = ["submitted", "confirming"];
      if (doneValue.includes(state)) return "done";
      else if (waitValue.includes(state)) return "wait";
      else return "fail";
    },
    currencyArray(currency) {
      const currencies = PublicController.currencies;
      for (const i in currencies) {
        if (currencies[i].id === currency) return currencies[i];
      }
    },
    openBox() {
      ZSmartModel.emit("open-box");
      this.$nextTick(() => {
        this.showBox = true;
      });
    },
    closeBox() {
      this.showBox = false;
    },
    changeBox() {
      if (!this.showBox) this.openBox();
      else this.closeBox();
    }
  }
};
</script>
