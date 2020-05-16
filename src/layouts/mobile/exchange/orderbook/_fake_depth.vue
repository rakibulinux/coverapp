<template>
  <dd>
    <p v-for="(data, index) in fakeDepth(side)" :key="index">
      <span :class="['text-left', trendType(side)]">---</span>
      <span class="text-right">---</span>
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