<template>
  <div class="ex_table table_noscroll right-panel">
    <dt>
      <span class="text-left">{{ side }}</span>
    </dt>
    <dd>
      <p
        v-for="order in depth()"
        :key="order[0]"
        :style="{
          backgroundSize: ((order.key * order.data) / maxTotal) * 100 + '% 100%'
        }"
        :class="side"
      >
        <span v-if="side === 'bids'" class="text-left">
          {{ getAmount(order.data) }}
        </span>
        <span v-if="side === 'bids'" class="text-right text-up">
          {{ getPrice(order.key) }}
        </span>

        <span v-if="side === 'asks'" class="text-left text-down">
          {{ getPrice(order.key) }}
        </span>
        <span v-if="side === 'asks'" class="text-right">
          {{ getAmount(order.data) }}
        </span>
      </p>
    </dd>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Depth extends Vue {
  @Prop() readonly side!: "bids" | "asks";
  @Prop() readonly getPrice!: (price: number) => string;
  @Prop() readonly getAmount!: (amount: number) => string;

  get maxTotal() {
    let total = 0;
    this.depth().forEach(row => {
      total += Number(row.key * row.data);
    });

    return total;
  }

  depth() {
    let depth_by_side = store.state.exchange.depth.toArray(this.side);
    if (this.side === "asks") {
      depth_by_side = depth_by_side.reverse();
    }

    return depth_by_side.splice(0, 15);
  }
}
</script>
