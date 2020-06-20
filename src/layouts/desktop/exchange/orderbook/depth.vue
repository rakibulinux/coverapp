<template>
  <div :style="style">
    <p
      v-for="order in depth()"
      :key="order.price"
      class="z-table-row"
      :style="{
        backgroundSize:
          (((order.price * order.amount) / maxTotal) * 100).toFixed(0) +
          '% 100%'
      }"
      @click="on_depth_clicked(order)"
    >
      <span
        :class="['text-left', trendType(side)]"
        v-text="getPrice(order.price)"
      />
      <span class="text-right" v-text="getAmount(order.price)" />
      <span class="text-right" v-text="getVolume(order.price, order.amount)" />
    </p>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { Vue, Component, Prop } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";

@Component
export default class MarketDepth extends Vue {
  @Prop() readonly side!: "asks" | "bids";

  whShow = "normal";

  market = helpers.isMarket();
  isBid = helpers.isBidSymbol().toUpperCase();
  isAsk = helpers.isAskSymbol().toUpperCase();

  get maxTotal() {
    let total = 0;
    this.depth().forEach(row => {
      total += Number(row.price * row.amount);
    });

    return total;
  }

  get style() {
    return this.side === "bids"
      ? "position: absolute;width: 100%;top: 0;"
      : "position: absolute;width: 100%;bottom: 0;";
  }

  mounted() {
    ZSmartModel.on("update-depth", () => {
      this.$forceUpdate();
    });
  }

  beforeDestroy() {
    ZSmartModel.remove("update-depth");
  }

  depth() {
    const orderbook = store.state.exchange.depth;
    return orderbook
      .toArray(this.side)
      .map(order => {
        return { price: order.key, amount: order.data };
      })
      .filter(order => order.price > 0 && order.amount > 0);
  }

  trendType(type) {
    return helpers.trendType(type);
  }

  on_depth_clicked(order: { price: number; amount: number }) {
    const price = order.price;
    let orders_with_range: [number, number][];
    const orders = store.state.exchange.depth[this.side].orders;
    if (this.side === "bids") {
      orders_with_range = orders.getRange(orders.minKey(), order.price, true);
    } else {
      orders_with_range = orders.getRange(order.price, orders.maxKey(), true);
    }

    ZSmartModel.emit(
      "depth-click",
      price,
      orders_with_range
        .map(order => order[1])
        .reduce((previousValue, currentValue) => previousValue + currentValue)
    );
  }

  getPrice(price: number) {
    return price.toFixed(helpers.pricePrecision());
  }

  getAmount(amount: number) {
    return amount.toFixed(helpers.amountPrecision());
  }

  getVolume(price: number, amount: number) {
    return (price * amount).toFixed(helpers.totalPrecision());
  }
}
</script>
