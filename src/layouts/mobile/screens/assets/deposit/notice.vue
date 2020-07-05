<template>
  <div class="assets-deposit-notice">
    <div class="assets-deposit-notice-title">Notice:</div>
    <ul class="assets-deposit-notice-content">
      <li
        v-for="(notice, index) in NOTICE"
        :key="index"
        class="assets-deposit-notice-item"
      >
        {{ item_prefix }} {{ notice }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DepositNotice extends Vue {
  @Prop() readonly currency!: ZTypes.Currency;

  item_prefix = "•";

  get NOTICE() {
    return [
      `Deposit to the above address requires ${this.currency.min_confirmations} confirmations`
    ];
  }
}
</script>
