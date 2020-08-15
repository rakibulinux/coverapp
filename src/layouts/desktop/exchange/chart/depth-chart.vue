<template>
  <div :id="element_id"></div>
</template>

<script lang="ts">
import TradeController from "@/controllers/trade";
import uuid from "uuid/v4";
import ResizeObserver from "resize-observer-polyfill";
import { Chart } from "@/library/depth-chart";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class DepthChart extends Vue {
  chart: Chart;
  element_id = uuid();
  resize_observer: ResizeObserver;
  limit_depth = 500;

  uuid_callback: string;

  get orderbook() {
    return TradeController.orderbook;
  }

  depth() {
    const SIDE = ["bids", "asks"];
    const orderbook = this.orderbook;
    const data: Chart["depth_data"] = { buy: [], sell: [] };

    for (const side of SIDE) {
      let total = 0;
      const depth_by_side = orderbook.toArray(
        side as "asks" | "bids",
        this.limit_depth
      );
      depth_by_side.forEach(row => {
        if (!row.price || !row.amount) return;

        total = Number(total + row.amount).toFixedNumber(4);

        data[side === "bids" ? "buy" : "sell"].push({
          price: row.price,
          volume: row.amount,
          total
        });
      });
    }

    return {
      buy: data.buy,
      sell: data.sell
    };
  }

  mounted() {
    this.chart = new Chart(this.element_id);

    this.set_chart_config();
    this.chart.init();

    this.resize_observer = new ResizeObserver(() => {
      this.chart.resize();
    });
    this.resize_observer.observe(this.$el);

    this.uuid_callback = this.orderbook.add_callback(() => {
      const depth = this.depth();

      this.chart.depth_data = depth;
      if (!this.chart.chart_ready) return;
      this.chart.draw();
    });
  }

  beforeDestroy() {
    this.orderbook.remove_callback(this.uuid_callback);
    this.resize_observer.unobserve(this.$el);
    this.chart.destroy();
  }

  set_chart_config() {
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
  }
}
</script>
