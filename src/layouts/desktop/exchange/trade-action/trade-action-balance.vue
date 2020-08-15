<template>
  <div class="trade-action-balance">
    <span>
      {{ $t("table.available") }}: {{ balance() }}
      {{ currency.toUpperCase() }}
    </span>

    <router-link class="trade-action-balance-action" to="/assets/balance">
      Deposit
    </router-link>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";

export default {
  props: {
    currency: String
  },
  computed: {
    isAuth: () => helpers.isAuth()
  },
  methods: {
    balance() {
      return new helpers.Balance(this.currency).available;
    }
  }
};
</script>
