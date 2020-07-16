<template>
  <z-card class="page-exchange-chart" title="Chart" :bordered="false">
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
      :class="[
        'page-exchange-chart-item',
        { 'page-exchange-chart-item-selected': whChart === 'depth-chart' }
      ]"
    />
  </z-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "trading-view-chart": () => import("./tradingview-chart.vue"),
    "depth-chart": () => import("./depth-chart.vue")
  }
})
export default class MainChart extends Vue {
  whChart = "tradingview-chart";
}
</script>

<style lang="less">
.page-exchange-chart {
}
</style>
