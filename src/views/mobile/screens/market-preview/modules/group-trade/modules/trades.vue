<template>
  <div class="trades">
    <div class="ex_table table_noscroll">
      <dt>
        <span class="text-left">Time</span>
        <span class="text-center">Price</span>
        <span class="text-right">Amount</span>
      </dt>
      <dd>
        <p v-for="(trade, index) in trades" :key="index">
          <span class="text-left">{{ getTime(trade.created_at) }}</span>
          <span class="text-center" :class="trendType(trade.taker_type)">
            {{ getPrice(trade.price) }}
          </span>
          <span class="text-right">{{ getAmount(trade.amount) }}</span>
        </p>
      </dd>
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
export default {
  props: {
    market: Array,
    getPrice: Function,
    getAmount: Function,
    getTime: Function
  },
  computed: {
    trades() {
      return this.$store.state.exchange.trades.array.slice(0, 15);
    }
  },
  methods: {
    trendType: value => helpers.trendType(value)
  }
};
</script>
