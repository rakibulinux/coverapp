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
import ZSmartModel from "@zsmartex/z-eventbus";

export default {
  props: {
    currency: String
  },
  computed: {
    isAuth: () => helpers.isAuth()
  },
  mounted() {
    ZSmartModel.on("balance-update", currency => {
      if (this.currency !== currency) return;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    });
  },
  beforeDestroy() {
    ZSmartModel.remove("balance-update");
  },
  methods: {
    balance() {
      return (new helpers.Balance(this.currency).getAvailable() || "0");
    }
  }
};
</script>
