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

<script lang="ts">
import store from "@/store";
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Trades extends Vue {
  @Prop() readonly getPrice!: (price: number) => string;
  @Prop() readonly getAmount!: (amount: number) => string;
  @Prop() readonly getTime!: (time: Date) => string;

  get trades() {
    return store.state.exchange.trades.slice(0, 15);
  }

  trendType(value: ZTypes.Side) {
    return helpers.trendType(value);
  }
}
</script>
