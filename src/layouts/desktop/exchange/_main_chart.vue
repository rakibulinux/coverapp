<template>
  <z-card
    id="main_chart"
    title="Chart"
    :bordered="false"
  >
    <div slot="extra" class="switch">
      <button
        :class="{ selected: whChart === 'tradingview' }"
        @click="whChart = 'tradingview'"
      >
        Candle
      </button>
      <button
        :class="{ selected: whChart === 'depth' }"
        @click="whChart = 'depth'"
      >
        Depth
      </button>
    </div>
    <trading-view-chart v-show="whChart === 'tradingview'" />
    <depth-chart
      v-show="whChart === 'depth'"
      :wrap-height="wrapHeight"
      :wrap-width="wrapWidth"
    />
  </z-card>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "trading-view-chart": () => import("./chart/_tradingview.vue"),
    "depth-chart": () => import("./chart/depth")
  }
})
export default class MainChart extends Vue {
  whChart = "tradingview";
  wrapHeight = 0;
  wrapWidth = 0;
  
  mounted() {
    this.wrapHeight = this.$el.offsetHeight;
    this.wrapWidth = this.$el.offsetWidth;
    window.addEventListener("resize", () => {
      this.wrapHeight = this.$el.offsetHeight - 40;
      this.wrapWidth = this.$el.offsetWidth;
    });
  }
};
</script>
