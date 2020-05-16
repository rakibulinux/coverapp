<template>
  <span v-if="!isAuth" class="balance" v-text="$t('table.available')" />
  <span v-else class="balance">
    {{ $t("table.available") }}: {{ balance() }}
    {{ currency }}
  </span>
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
      return new helpers.Balance(this.currency).getAvailable();
    }
  }
};
</script>
