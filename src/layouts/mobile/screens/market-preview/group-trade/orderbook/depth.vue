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
          {{ getAmount(order.amount) }}
        </span>
        <span v-if="side === 'bids'" class="text-right text-up">
          {{ getPrice(order.price) }}
        </span>

        <span v-if="side === 'asks'" class="text-left text-down">
          {{ getPrice(order.price) }}
        </span>
        <span v-if="side === 'asks'" class="text-right">
          {{ getAmount(order.amount) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import TradeController from "@/controllers/trade";
import * as helpers from "@zsmartex/z-helpers";
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component
export default class Depth extends Mixins(MarketMixin) {
  @Prop() readonly market!: ZTypes.Market;
  @Prop() readonly side!: ZTypes.TakerType;

  uuid_callback: string;

  get orderbook() {
    return TradeController.orderbook;
  }

  get maxTotal() {
    let total = 0;
    this.depth().forEach(row => {
      total += Number(row.price * row.amount);
    });

    return total;
  }

  mounted() {
    this.uuid_callback = this.orderbook.add_callback(side => {
      if (this.side === side) this.$forceUpdate();
    });
  }

  beforeDestroy() {
    this.orderbook.remove_callback(this.uuid_callback);
  }

  depth() {
    const depth = this.orderbook.toArray(this.side);

    return depth.splice(0, 15);
  }

  trendType(value: ZTypes.OrderSide) {
    return helpers.trendType(value);
  }
}
</script>
