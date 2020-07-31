<template>
  <div class="svg-box" />
</template>

<script>
import colors from "@/colors";
import sparkline from "@/library/sparkline";

export default {
  props: {
    data: Array
  },
  mounted() {
    this.$nextTick(() => {
      sparkline(this.$el, {
        values: this.data,
        width: this.$el.clientWidth,
        height: this.$el.clientHeight,
        lineWidth: 1,
        spotColor: "transparent",
        highlightSpotColor: "transparent",
        highlightLineColor: "transparent",
        minSpotColor: "transparent",
        maxSpotColor: "transparent",
        lineColor: colors["blue-dark-color"],
        fillColor: colors["bg-card-head-color"],
        borderColor: "transparent"
      });
    });
  }
};
</script>
