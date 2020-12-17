<template>
  <div
    class="z-table-row depth-row"
    :style="{
      backgroundSize:
        (((order.price * order.amount) / maxSum) * 100).toFixedNumber(0) +
        '% 100%'
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
  @Prop() readonly side!: "asks" | "bids";
  @Prop() readonly maxSum!: number;
  @Prop() readonly order: { price: number; amount: number };
}
</script>
