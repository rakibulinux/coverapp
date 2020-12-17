<template>
  <div
    :style="{
      backgroundSize: ((price * amount) / maxTotal) * 100 + '% 100%'
    }"
    class="depth-row"
  >
    <span v-if="side === 'bids'" class="text-left">
      {{ getAmount(amount) }}
    </span>
    <span v-if="side === 'bids'" class="text-right text-up">
      {{ getPrice(price) }}
    </span>

    <span v-if="side === 'asks'" class="text-left text-down">
      {{ getPrice(price) }}
    </span>
    <span v-if="side === 'asks'" class="text-right">
      {{ getAmount(amount) }}
    </span>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Vue, Component, Mixins, Prop } from "vue-property-decorator";

@Component
export default class DepthRow extends Mixins(MarketMixin){
  @Prop() readonly market_id!: string;
  @Prop() readonly side!: ZTypes.TakerType;
  @Prop() readonly maxTotal!: number;
  @Prop() readonly price!: number;
  @Prop() readonly amount!: number;
}
</script>
