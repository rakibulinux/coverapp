<template>
  <div :id="element_id" />
</template>

<script lang="ts">
import uuid from "uuid/v4";
import store from "@/store";
import * as helpers from "@zsmartex/z-helpers";
import { Chart, DepthData } from "./depth-chart";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class DepthChart extends Vue {
  @Prop() readonly market_id!: string;
  @Prop() readonly showing!: boolean;
  element_id = uuid();
  chart!: Chart;

  get price_precision() {
    return helpers.pricePrecision(this.market_id);
  }

  get amount_precision() {
    return helpers.amountPrecision(this.market_id);
  }

  get depth() {
    const SIDE = ["bids", "asks"];
    const depth = store.state.exchange.depth;
    const data: { buy: DepthData[]; sell: DepthData[] } = { buy: [], sell: [] };

    for (const side of SIDE) {
      let total = 0;
      let depth_by_side =
        side === "bids" ? depth.toArray(side) : depth.toArray("asks").reverse();
      depth_by_side = depth_by_side.splice(0, 100);
      depth_by_side.forEach(row => {
        const item = {
          price: null,
          volume: null,
          total: null
        };

        total = Number(total + row.data);
        item.price = row.key;
        item.volume = row.data;
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
    window.addEventListener("resize", () => {
      this.chart.resize();
    });
  }

  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.chart.resize();
    });
    this.chart.destroy();
  }

  @Watch("depth")
  onDepthChanged(depth: this["depth"]) {
    this.chart.depth_data = depth;
    if (!this.chart.chart_ready && !this.showing) return;
    this.chart.draw_chart();
  }

  @Watch("showing")
  onShowingChanged(showing: boolean) {
    if (showing) this.chart.draw_chart();
  }
}
</script>

<style>
.depth-chart canvas {
  position: absolute;
}
</style>
