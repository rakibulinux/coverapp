<template>
  <div class="depth" :class="[`depth-${side}`]">
    <div :style="style">
      <p
        v-for="(order, index) in depth"
        :key="index"
        :style="{
          backgroundSize:
            (((order.price * order.amount) / maxTotal) * 100).toFixed(0) +
            '% 100%'
        }"
        class="z-table-row"
        @click="on_depth_clicked(order)"
      >
        <span
          :class="['text-left', trendType(side)]"
          v-text="getPrice(order.price)"
        />
        <span class="text-right" v-text="getAmount(order.amount)" />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { TradeController } from "@/controllers";
import store from "@/store";
import { Vue, Component, Prop } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";

@Component
export default class MarketDepth extends Vue {
  @Prop() readonly side!: "asks" | "bids";

  get market() {
    return TradeController.market;
  }

  get orderbook() {
    return TradeController.orderbook;
  }

  get maxTotal() {
    let total = 0;
    this.depth.forEach(row => {
      total += Number(row.price * row.amount);
    });

    return total;
  }

  get style() {
    return this.side === "bids"
      ? "position: absolute;width: 100%;top: 0;"
      : "position: absolute;width: 100%;bottom: 0;";
  }

  get depth() {
    const orderbook = this.orderbook;
    const depth = orderbook.toArray(this.side, 6);
    return this.side === "bids" ? depth : depth.reverse();
  }

  trendType(type) {
    return helpers.trendType(type);
  }

  on_depth_clicked(order: { price: number; amount: number }) {
    const price = order.price;
    const orders = this.depth;
    const index = orders.findIndex(ord => ord.price === order.price);
    let orders_with_range: { price: number; amount: number }[];

    if (index < 0) return;

    if (this.side === "bids") {
      orders_with_range =
        index === 0 ? [orders[0]] : orders.slice(0, index + 1);
    } else {
      orders_with_range =
        index === orders.length - 1
          ? [orders[orders.length - 1]]
          : orders.slice(index, orders.length);
    }

    const amount = orders_with_range
      .map(order => order.amount)
      .reduce((previousValue, currentValue) => previousValue + currentValue);

    ZSmartModel.emit("depth-click", price, amount);
  }

  getPrice(price: number) {
    return price.toFixed(this.market.price_precision);
  }

  getAmount(amount: number) {
    return amount.toFixed(this.market.amount_precision);
  }
}
</script>
