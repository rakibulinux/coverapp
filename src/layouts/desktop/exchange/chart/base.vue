<template>
  <z-card class="page-exchange-chart" title="Chart" :bordered="false">
    <div slot="title">
      <div v-if="whChart === 'depth-chart'">
        X-axis starting point:
        <a-select
          :default-value="500"
          style="width: 120px"
          @change="change_limit_depth"
        >
          <a-select-option
            v-for="(limit, index) in limit_depth"
            :key="index"
            :value="limit.value"
          >
            {{ limit.text }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div slot="extra" class="switch">
      <button
        :class="{ selected: whChart === 'tradingview-chart' }"
        @click="whChart = 'tradingview-chart'"
      >
        Candle
      </button>
      <button
        :class="{ selected: whChart === 'depth-chart' }"
        @click="whChart = 'depth-chart'"
      >
        Depth
      </button>
    </div>
    <trading-view-chart
      :class="[
        'page-exchange-chart-item',
        {
          'page-exchange-chart-item-selected': whChart === 'tradingview-chart'
        }
      ]"
    />
    <depth-chart
      ref="depth-chart"
      :class="[
        'page-exchange-chart-item',
        { 'page-exchange-chart-item-selected': whChart === 'depth-chart' }
      ]"
    />
  </z-card>
</template>

<script lang="ts">
import DepthChart from "./depth-chart.vue";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "trading-view-chart": () => import("./tradingview-chart.vue"),
    "depth-chart": DepthChart
  }
})
export default class MainChart extends Vue {
  $refs: {
    "depth-chart": DepthChart;
  };

  whChart = "tradingview-chart";
  limit_depth = [
    { value: 10, text: 10 },
    { value: 20, text: 20 },
    { value: 100, text: 100 },
    { value: 500, text: "All" }
  ];

  change_limit_depth(limit) {
    this.$refs["depth-chart"].limit_depth = limit;
  }
}
</script>

<style lang="less">
.page-exchange-chart {
}
</style>
