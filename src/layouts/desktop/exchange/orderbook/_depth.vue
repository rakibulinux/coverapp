<template>
  <div :style="style">
    <p
      v-for="data in depth()"
      :key="data.key"
      class="order"
      :style="{
        backgroundSize:
          ((getVolume(data.data, data.key) / maxTotal) * 100).toFixed(0) +
          '% 100%'
      }"
    >
      <span
        :class="['text-left', trendType(side)]"
        v-text="getPrice(data.key)"
      />
      <span class="text-right" v-text="getAmount(data.data)" />
      <span class="text-right" v-text="getVolume(data.data, data.key)" />
    </p>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";

export default {
  props: {
    side: String
  },
  data: () => ({
    whShow: "normal"
  }),
  computed: {
    market: () => helpers.isMarket(),
    isBid: () => helpers.isBidSymbol().toUpperCase(),
    isAsk: () => helpers.isAskSymbol().toUpperCase(),
    maxTotal() {
      var total = 0;
      this.depth().forEach(row => {
        total += Number(row.key * row.data);
      });

      return total;
    },
    style() {
      return this.side === "bids"
        ? "position: absolute;width: 100%;top: 0;"
        : "position: absolute;width: 100%;bottom: 0;";
    }
  },
  mounted() {
    ZSmartModel.on("update-depth", () => {
      this.$forceUpdate();
    });
  },
  beforeDestroy() {
    ZSmartModel.remove("update-depth");
  },
  methods: {
    depth() {
      const orderbook = this.$store.state.exchange.depth;
      return orderbook.toArray(this.side);
    },
    trendType: type => helpers.trendType(type),
    findIndexOrder(depth, price) {
      return depth.findIndex(row => row[0] == price);
    },
    onRowClicked(order) {
      const { depth } = this;
      const indexOrder = this.findIndexOrder(depth, order.key);
      let amount = 0;
      if (this.side === "bids") {
        let index = 0;
        while (index <= indexOrder) {
          amount += depth[index].data;
          index++;
        }
      } else {
        if (depth.length - indexOrder > 1) {
          let index = depth.length - 1;
          while (index >= indexOrder) {
            amount += depth[index].data;
            index--;
          }
        } else amount = depth[indexOrder].data;
      }
      const payload = {
        price: order.key,
        amount: amount
      };
      ZSmartModel.emit("onBookClick", payload);
    },
    getPrice: price => (price * 1).toFixed(helpers.pricePrecision()),
    getAmount: amount => (amount * 1).toFixed(helpers.amountPrecision()),
    getVolume: (price, amount) =>
      (price * amount).toFixed(helpers.totalPrecision())
  }
};
</script>
