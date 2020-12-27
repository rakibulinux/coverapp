<template>
  <div
    class="z-table-row depth-row"
    :style="{
      backgroundSize: size_percent + '% 100%'
    }"
    @click="$emit('click')"
    @mouseover="$emit('mouseover')"
    @mouseleave="$emit('mouseleave')"
  >
    <span
      :class="['text-left', trendType(side)]"
      v-text="getPrice(order.price)"
    />
    <span class="text-right" v-text="getAmount(order.amount)" />
    <span class="text-right" v-text="getTotal(order.price * order.amount)" />
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component
export default class DepthRow extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;
  @Prop() readonly side!: "asks" | "bids";
  @Prop() readonly maxSum!: number;
  @Prop() readonly order: { price: number; amount: number };

  get size_percent() {
    return Math.min(((this.order.price * this.order.amount) / this.maxSum) * 100 * 3, 100);
  }
}
</script>
