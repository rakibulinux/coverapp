<template>
  <div class="z-table z-table-borderable z-table-no-scroll" :class="side">
    <div class="z-table-head">
      <template v-if="side === 'bids'">
        <span class="text-left">
          Amount({{ market.base_unit.toUpperCase() }})
        </span>
        <span class="text-right">
          Price({{ market.quote_unit.toUpperCase() }})
        </span>
      </template>
      <template v-else>
        <span class="text-left">
          Price({{ market.quote_unit.toUpperCase() }})
        </span>
        <span class="text-right">
          Amount({{ market.base_unit.toUpperCase() }})
        </span>
      </template>
    </div>
    <div class="z-table-content">
      <div
        v-for="order in depth()"
        :key="order[0]"
        :style="{
          backgroundSize: ((order.key * order.data) / maxTotal) * 100 + '% 100%'
        }"
        :class="['z-table-row', 'depth-row']"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import * as helpers from "@zsmartex/z-helpers";
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component
export default class Depth extends Mixins(MarketMixin) {
  @Prop() readonly market!: ZTypes.Market;
  @Prop() readonly side!: "bids" | "asks";

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

  trendType(value: ZTypes.Side) {
    return helpers.trendType(value);
  }
}
</script>
