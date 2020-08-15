<template>
  <div class="order-row-circle-filled">
    <a-progress
      type="circle"
      :percent="filled"
      :width="width"
      :strokeWidth="strokeWidth"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class CircleFilled extends Vue {
  @Prop() readonly filled: number;
  @Prop() readonly side: ZTypes.OrderSide;

  width = 35;
  strokeWidth = 5;
}
</script>
