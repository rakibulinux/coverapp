<template>
  <p
    :style="{
      backgroundSize:
        (((order.price * order.amount) / maxTotal) * 100).toFixed(0) + '% 100%'
    }"
    class="z-table-row"
    @click="on_depth_clicked(order)"
  >
    <span
      :class="['text-left', trendType(side)]"
      v-text="getPrice(order.price)"
    />
    <span class="text-right" v-text="getAmount(order.amount)" />
  </p>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DepthRow extends Vue {
  @Prop() readonly;
}
</script>
