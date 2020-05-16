<template>
  <dd>
    <p
      v-for="data in getDepth[side]"
      :key="data[0]"
      :style="{ backgroundSize:  (getVolume(data[1], data[0]) / maxTotal[side] * 100).toFixed(0) + '% 100%' }"
    >
      <span :class="['text-left', trendType(side)]">{{ getPrice(data[0]) }}</span>
      <span class="text-right">{{ getAmount(data[1]) }}</span>
    </p>
  </dd>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "./helpers";

export default {
  mixins: [Helpers],
  props: {
    side: String
  },
  methods: {
    trendType: type => helpers.trendType(type)
  }
};
</script>