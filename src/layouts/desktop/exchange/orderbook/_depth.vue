<template>
  <div :style="style">
    <p
      v-for="data in depth()"
      :key="data.key"
      class="z-table-row"
      :style="{
        backgroundSize:
          (((data.key * data.data) / maxTotal) * 100).toFixed(0) + '% 100%'
      }"
      @click="on_depth_clicked(data)"
    >
      <span
        :class="['text-left', trendType(side)]"
        v-text="getPrice(data.key)"
      />
      <span class="text-right" v-text="getAmount(data.data)" />
      <span class="text-right" v-text="getVolume(data.key, data.data)" />
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
      total += Number(row.key * row.data);
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
    return orderbook.toArray(this.side);
  }

  trendType(type) {
    return helpers.trendType(type);
  }

  on_depth_clicked(order: { key: number; data: number }) {
    const price = order.key;
    let orders_with_range: [number, number][];
    const orders = store.state.exchange.depth[this.side].orders;
    if (this.side === "bids") {
      orders_with_range = orders.getRange(orders.minKey(), order.key, true);
    } else {
      orders_with_range = orders.getRange(order.key, orders.maxKey(), true);
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
