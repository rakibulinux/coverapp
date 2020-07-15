<template>
  <z-card id="main_chart" title="Chart" :bordered="false">
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
  </z-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "trading-view-chart": () => import("./chart/_tradingview.vue"),
    "depth-chart": () => import("./chart/depth/index.vue")
  }
})
export default class MainChart extends Vue {
  whChart = "tradingview";

  mounted() {
    window.addEventListener("resize", () => {
      this.$forceUpdate();
    });
  }

  wrapHeight() {
    const element = this.$el as HTMLElement;

    if (element) return element.offsetHeight - 40;
    return 0;
  }

  wrapWidth() {
    const element = this.$el as HTMLElement;

    if (element) return element.offsetWidth;
    return 0;
  }
}
</script>
