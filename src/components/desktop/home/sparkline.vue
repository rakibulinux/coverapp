<template>
  <div class="svg-box">
    <svg ref="svg" width="226" height="50" stroke-width="1" />
  </div>
</template>

<script>
import { sparkline } from "@/assets/js";

export default {
  props: {
    data: Array
  },
  mounted() {
    const element = this.$refs["svg"];

    sparkline(element, this.data);
    /*$().sparkline(this.data, {
      type: "line",
      width: "100%",
      height: "100%",
      spotRadius: "0",
      lineColor: "#2d3b5f",
      disableHighlight: true,
      disableInteraction: true,
      fillColor: "#202d4c",
      disableTooltips: true
    });*/
  }
};
</script>
