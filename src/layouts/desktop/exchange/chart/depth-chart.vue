<template>
  <div :id="element_id"></div>
</template>

<script lang="ts">
import store from "@/store";
import uuid from "uuid/v4";
import { Chart } from "@/library/depth-chart";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class DepthChart extends Vue {
  chart: Chart;
  element_id = uuid();

  get depth() {
    const SIDE = ["bids", "asks"];
    const depth = store.state.exchange.depth;
    const data: Chart["depth_data"] = { buy: [], sell: [] };

    for (const side of SIDE) {
      let total = 0;
      let depth_by_side =
        side === "bids" ? depth.toArray(side) : depth.toArray("asks").reverse();
      depth_by_side = depth_by_side.splice(0, 500);
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

    this.chart.config.chart.strokeSize = 2;

    this.chart.config.xAxis.height = 30;
    this.chart.config.xAxis.axisLine.size = 1;
    this.chart.config.xAxis.tickText.size = 12;
    this.chart.config.xAxis.tickText.margin = (30 + 12) / 2;

    this.chart.config.yAxis.width = 60;
    this.chart.config.yAxis.axisLine.size = 1;
    this.chart.config.yAxis.tickLine.display = true;
    this.chart.config.yAxis.tickLine.width = 8;
    this.chart.config.yAxis.tickLine.size = 1;
    this.chart.config.yAxis.tickText.size = 12;
    this.chart.config.yAxis.tickText.margin = 12;
    this.chart.config.yAxis.tickText.baseLine = "middle";
    this.chart.config.yAxis.tickText.position = "outside";

    this.chart.config.gird.horizontal.size = 0.5;
    this.chart.config.gird.vertical.size = 1;

    this.chart.config.tooltip.type = "rect";
    this.chart.config.tooltip.crosshair.type = "dash";
    this.chart.config.tooltip.crosshair.color = "side";
    this.chart.config.tooltip.crosshair.dashValue = [4, 4];
    this.chart.init();
  }

  @Watch("depth")
  onDepthChanged(depth: Chart["depth_data"]) {
    this.chart.depth_data = depth;
    if (!this.chart.chart_ready) return;
    this.chart.draw();
  }
}
</script>
