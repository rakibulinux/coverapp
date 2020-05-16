<template>
  <a-card
    id="main_chart"
    title="Chart"
    :bordered="false"
    class="ant-card-wider-padding ant-card-padding-transition"
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
    <trading-view v-show="whChart === 'tradingview'" />
    <depth
      v-show="whChart === 'depth'"
      :wrap-height="wrapHeight"
      :wrap-width="wrapWidth"
    />
  </a-card>
</template>

<script>
import _tradingview from "./chart/_tradingview.vue";
import _depth from "./chart/depth";

export default {
  name: "MainChart",
  components: {
    "trading-view": _tradingview,
    depth: _depth
  },
  data: () => ({
    whChart: "tradingview",
    wrapHeight: 0,
    wrapWidth: 0
  }),
  mounted() {
    this.wrapHeight = this.$el.offsetHeight;
    this.wrapWidth = this.$el.offsetWidth;
    setTimeout(() => {
      this.wrapHeight = this.$el.offsetHeight - 40;
      this.wrapWidth = this.$el.offsetWidth;
    }, 100);
    window.addEventListener("resize", () => {
      this.wrapHeight = this.$el.offsetHeight - 40;
      this.wrapWidth = this.$el.offsetWidth;
    });
  }
};
</script>
