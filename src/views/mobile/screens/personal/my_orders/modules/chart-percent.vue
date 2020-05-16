<template>
  <svg width="35px" height="35px" viewBox="0 0 40 40">
    <circle
      class="donut-chart-hole"
      cx="20"
      cy="20"
      r="15.91549430918954"
      fill="#fff"
    ></circle>
    <circle
      class="donut-chart-ring"
      cx="20"
      cy="20"
      r="15.91549430918954"
      fill="transparent"
      stroke-width="2"
    ></circle>
    <circle
      class="donut-chart-segment"
      cx="20"
      cy="20"
      r="15.91549430918954"
      fill="transparent"
      stroke-width="2"
      :stroke-dasharray="getChartPercent"
      stroke-dashoffset="25"
    ></circle>
    <g class="donut-chart-text">
      <text y="50%" transform="translate(0, 3.5)">
        <tspan x="50%" text-anchor="middle" class="donut-chart-percent">
          {{ filled }}%
        </tspan>
      </text>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    filled: Number
  },
  computed: {
    getChartPercent() {
      const { filled } = this;

      return [filled, 100 - filled].join(" ");
    }
  }
};
</script>
