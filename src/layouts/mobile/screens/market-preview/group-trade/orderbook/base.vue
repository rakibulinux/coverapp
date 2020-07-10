<template>
  <div class="orderbook">
    <depth v-for="side in SIDE" :key="side" :market="market" :side="side" />
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
  @Prop() readonly market!: ZTypes.Market;

  SIDE = ["bids", "asks"];
}
</script>
