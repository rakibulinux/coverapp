<template>
  <div
    class="depth-row"
  >
    <span v-if="side === 'bids'" class="text-left">
      --
    </span>
    <span v-if="side === 'bids'" class="text-right text-up">
      --
    </span>

    <span v-if="side === 'asks'" class="text-left text-down">
      --
    </span>
    <span v-if="side === 'asks'" class="text-right">
      --
    </span>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Vue, Component, Mixins, Prop } from "vue-property-decorator";

@Component
export default class DepthRow extends Mixins(MarketMixin){
  @Prop() readonly side!: ZTypes.TakerType;
}
</script>
