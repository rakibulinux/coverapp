<template>
  <div class="trade-action-balance">
    <div class="trade-action-balance-row">
      <span class="trade-action-balance-title">
        Available {{ currency_id }}
      </span>
      <span class="trade-action-balance-value">--</span>
    </div>
    <div class="trade-action-balance-row">
      <span class="trade-action-balance-title"> Locked {{ currency_id }} </span>
      <span class="trade-action-balance-value">--</span>
    </div>
    <div class="trade-action-balance-row">
      <span class="trade-action-balance-title"> Total {{ currency_id }} </span>
      <span class="trade-action-balance-value">--</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TradeActionBalance extends Vue {
  @Prop() readonly currency_id!: string;
}
</script>
