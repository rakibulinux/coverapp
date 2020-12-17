<template>
  <div class="orderbook">
    <depth v-for="side in SIDE" :key="side" :market_id="market.id" :side="side" />
  </div>
</template>

<script lang="ts">
import { PublicController } from "@/controllers";
import { MarketMixin } from "@/mixins/mobile";
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";

@Component({
  components: {
    depth: () => import("./depth.vue")
  }
})
export default class OrderBook extends Mixins(MarketMixin) {
  @Prop() readonly market_id!: string;

  SIDE = ["bids", "asks"];
}
</script>
