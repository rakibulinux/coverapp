<template>
  <div class="orderbook">
    <depth
      v-for="side in SIDE"
      :key="side"
      :side="side"
      :getPrice="getPrice"
      :getAmount="getAmount"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    depth: () => import("./depth.vue")
  }
})
export default class OrderBook extends Vue {
  @Prop() readonly getPrice!: (price: number) => string;
  @Prop() readonly getAmount!: (amount: number) => string;

  SIDE = ["bids", "asks"];
}
</script>
