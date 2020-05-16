<template>
  <z-content class="page-assets-m">
    <action-bar class="head-bar" :left-disabled="true">
      <div class="center-action">
        Assets
      </div>
    </action-bar>
    <div class="body-bar">
      <div class="information-assets">
        <div class="balance">
          <div class="note">
            Equity Value(BTC)
          </div>
          <div class="value">
            0.00000000 BTC
            <div class="valuation">
              ≈ $0.00
            </div>
          </div>
        </div>
        <div class="action">
          <button>Deposit</button>
          <button>Withdraw</button>
        </div>
      </div>

      <div class="table-currency setting-list">
        <setting-group
          v-if="$store.getters['user/getBalance'].length"
          :no-background="true"
        >
          <setting-row
            v-for="data in CURRENCY"
            :key="data.id"
            :allow-icon="false"
            :info="getTotal(data.id)"
            @click="openCurrencyPanel(data.id)"
          >
            <img src="https://img.icons8.com/color/48/000000/ethereum.png" />
            <span class="id">{{ data.id.toUpperCase() }}</span>
            <span class="name">({{ data.name }})</span>
          </setting-row>
        </setting-group>
      </div>
    </div>
    <currency-panel
      ref="currency-panel"
      :currency="currency"
      :open-panels="openPanels"
    />
    <deposit-panel ref="deposit-panel" :currency="currency" />
    <withdrawal-panel ref="withdrawal-panel" :currency="currency" />
  </z-content>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import _action_bar from "@/components/mobile/action-bar.vue";
import { currency, deposit, withdrawal } from "@/views/mobile/screens/assets";
import { _setting_group, _setting_row } from "@/components/mobile/settings";

export default {
  components: {
    "action-bar": _action_bar,
    "setting-row": _setting_row,
    "setting-group": _setting_group,
    "currency-panel": currency,
    "deposit-panel": deposit,
    "withdrawal-panel": withdrawal
  },
  data: () => ({
    currency: null
  }),
  computed: {
    CURRENCY() {
      return this.$store.getters["public/getAllCurrencies"];
    }
  },
  methods: {
    getAssets(currency) {
      return new helpers.Balance(currency);
    },
    getAvailable(currency) {
      const assets = this.getAssets(currency);
      return assets.getAvailable();
    },
    getLocked(currency) {
      const assets = this.getAssets(currency);
      return assets.getLocked();
    },
    getTotal(currency) {
      const assets = this.getAssets(currency);
      return assets.getTotal();
    },
    openCurrencyPanel(currency) {
      this.currency = currency;
      this.openPanels("currency-panel");
    },
    openPanels(panel) {
      this.$refs[panel].render();
    }
  }
};
</script>
