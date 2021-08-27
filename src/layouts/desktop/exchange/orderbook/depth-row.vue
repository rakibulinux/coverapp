<template>
  <v-group>
    <v-rect
      ref="rect"
      :config="{
        x: 0,
        y: 20 * index,
        height: 20,
        width: 320 / 100 * size_percent,
        fill: bg_color,
      }"
    />
    <v-text
      :config="{
        text: fake ? '----' : price.toFixed(market.price_precision),
        fontSize: 12,
        height: 20,
        width: 320 / 3,
        y: 20 * index,
        x: 16,
        verticalAlign: 'middle',
        fill: price_color,
      }"
    />
    <v-text
      :config="{
        text: fake ? '----' : amount.toFixed(market.amount_precision),
        fontSize: 12,
        height: 20,
        width: 320,
        y: 20 * index,
        x: -(320 / 3) - 8,
        verticalAlign: 'middle',
        align: 'right',
        fill: text_color,
      }"
    />
    <v-text
      :config="{
        text: fake ? '----' : total.toFixed(market.total_precision),
        fontSize: 12,
        height: 20,
        width: 320,
        y: 20 * index,
        x: -16,
        verticalAlign: 'middle',
        align: 'right',
        fill: text_color,
      }"
    />
  </v-group>
</template>

<script lang="ts">
import Konva from "konva";
import colors from "@/colors";
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class DepthRow extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;
  @Prop() readonly side!: "asks" | "bids";
  @Prop() readonly maxSum!: number;
  @Prop() readonly index!: number;
  @Prop() readonly order: { price: string; amount: string; fake: boolean; };

  current_price: number = null;
  current_amount: number = null;

  get fake() {
    return this.order.fake;
  }

  get price() {
    return Number(this.order.price);
  }

  get amount() {
    return Number(this.order.amount);
  }

  get total() {
    return this.price * this.amount
  }

  get price_color() {
    return this.side === "bids" ? colors["up-color"] : colors["down-color"];
  }

  get bg_color() {
    return this.side === "bids" ? colors["up-bg-color"] : colors["down-bg-color"];
  }

  get text_color() {
    return colors["text-default-color"];
  }

  get size_percent() {
    if (this.fake) {
      return null;
    }

    return Math.min(
      (this.total / this.maxSum) * 100 * 3,
      100
    );
  }
}
</script>
