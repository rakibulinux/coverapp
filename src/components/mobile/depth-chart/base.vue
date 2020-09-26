<template>
  <div :id="element_id" />
</template>

<script lang="ts">
import uuid from "uuid/v4";
import TradeController from "@/controllers/trade";
import * as helpers from "@zsmartex/z-helpers";
import { Chart } from "@/library/depth-chart";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DepthChart extends Vue {
  @Prop() readonly market_id!: string;
  @Prop() readonly showing!: boolean;
  element_id = uuid();
  chart!: Chart;
  uuid_callback: string;

  get orderbook() {
    return TradeController.orderbook;
  }

  get price_precision() {
    return helpers.pricePrecision(this.market_id);
  }

  get amount_precision() {
    return helpers.amountPrecision(this.market_id);
  }

  depth() {
    const SIDE = ["bids", "asks"];
    const data: Chart["depth_data"] = { buy: [], sell: [] };

    for (const side of SIDE) {
      let total = 0;
      const depth_by_side = this.orderbook.toArray(
        side as ZTypes.TakerType,
        100
      );
      depth_by_side.forEach(row => {
        const item = {
          price: null,
          volume: null,
          total: null
        };

        total = Number(total + row.amount);
        item.price = row.price;
        item.volume = row.amount;
        item.total = total.toFixedNumber(4);

        data[side === "bids" ? "buy" : "sell"].push(item);
      });
    }

    return {
      buy: data.buy,
      sell: data.sell
    };
  }

  mounted() {
    this.chart = new Chart(this.element_id);
    this.chart.init();
    window.addEventListener("resize", () => {
      //this.chart.resize();
    });
  }

  beforeDestroy() {
    this.chart.destroy();
  }
}
</script>

<style>
.depth-chart canvas {
  position: absolute;
}
</style>
