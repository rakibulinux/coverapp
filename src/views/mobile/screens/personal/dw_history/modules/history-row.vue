<template>
  <div class="history-row" @click="$emit('click', data)">
    <div class="text-left">
      <div class="info">
        <span class="currency">{{ data.currency.toUpperCase() }}</span>
        <span class="amount">{{ data.amount }}</span>
      </div>
      <div class="date">
        {{ date }}
      </div>
    </div>
    <div class="text-right">
      <span :class="['state', state]">
        {{ $t(`assets.history.state.${state}`, stateText) }}
      </span>
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";

export default {
  props: {
    data: Object
  },
  computed: {
    date() {
      return helpers.getDate(this.data.created_at, true);
    },
    state() {
      const { state } = this.data;
      const doneValue = ["accepted", "skipped", "collected", "succeed"];
      const waitValue = ["submitted", "confirming"];
      if (doneValue.includes(state)) return "completed";
      else if (waitValue.includes(state)) return "processing";
      else return "failed";
    },
    stateText() {
      const { confirmations, min_confirmations } = this;

      if (this.state === "processing") {
        return {
          confirmations,
          min_confirmations
        };
      } else return {};
    },
    confirmations() {
      return this.data.confirmations;
    },
    min_confirmations() {
      return new helpers.Currency(this.data.currency).get().min_confirmations;
    }
  },
  methods: {}
};
</script>
