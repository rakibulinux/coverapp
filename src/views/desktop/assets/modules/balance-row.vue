<template>
  <dl :class="{ selected: showBox }">
    <span class="coin">{{ currency.toUpperCase() }}</span>
    <span class="name">{{ getCurrencyName }}</span>
    <span class="total">{{ balance.getTotal() }}</span>
    <span class="available">{{ balance.getAvailable() }}</span>
    <span class="locked">{{ balance.getLocked() }}</span>
    <span class="btc_val">
      {{ balance.getTotalBTC() }}
      <p>≈ {{ balance.getTotalUSD() }} USD</p>
    </span>
    <span class="text-center action">
      <a
        :class="{
          selected: showBox && type === 'deposit'
        }"
        @click="changeAssets('deposit')"
        v-text="$t('action.deposit')"
      />
      <a
        :class="{
          selected: showBox && type === 'withdraw'
        }"
        @click="changeAssets('withdraw')"
        v-text="$t('action.withdrawal')"
      />
      <a-dropdown :trigger="['click']" placement="bottomCenter">
        <a class="ant-dropdown-link" href="#">
          {{ $t("action.exchange") }} <i class="ic-arrow-down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item
            v-for="market in MARKET"
            :key="market.id"
            @click="changeMarket(market.name)"
          >
            {{ market.name }}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </span>
    <div v-if="showBox" class="action-box">
      <deposit-box
        v-if="type === 'deposit'"
        :deposit-address="deposit_address || 'ERROR'"
        :currency-obj="getCurrency"
      />
      <withdraw-box
        v-else-if="type === 'withdraw'"
        :balance="getAvailable(currency)"
        :currency-obj="getCurrency"
      />
      <a-spin v-if="loading" size="large">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
    </div>
  </dl>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import _deposit from "@/layouts/desktop/assets/_deposit.vue";
import _withdraw from "@/layouts/desktop/assets/_withdraw.vue";

export default {
  components: {
    "deposit-box": _deposit,
    "withdraw-box": _withdraw
  },
  props: {
    currency: String
  },
  data: () => ({
    type: null,
    showBox: false,
    loading: false,
    deposit_address: null
  }),
  computed: {
    MARKET() {
      const { currency } = this;
      const TICKER = this.$store.getters["public/getAllMarkets"];
      return TICKER.filter(ticker => {
        if (ticker.base_unit === currency) return ticker;
      });
    },
    getCurrency() {
      const { currency } = this;
      return new helpers.Currency(currency).get();
    },
    getCurrencyName() {
      return this.getCurrency.name;
    },
    balance() {
      return new helpers.Balance(this.currency);
    }
  },
  mounted() {
    ZSmartModel.on("assets-box-open", this.clearShowBox);
    ZSmartModel.on("balance-update", currency => {
      if (this.currency.toLowerCase() !== currency) return;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    });
  },
  beforeDestroy() {
    ZSmartModel.remove("assets-box-open");
    ZSmartModel.remove("balance-update");
  },
  methods: {
    clearShowBox() {
      this.showBox = false;
      this.type = null;
    },
    beforeOpenBox() {
      ZSmartModel.emit("assets-box-open");
    },
    changeAssets(type) {
      this.beforeOpenBox();
      this.type = type;
      this.showBox = true;
      if (type === "deposit" && this.deposit_address === null) {
        this.$nextTick(() => this.getDepositAddress());
      }
    },
    getDepositAddress() {
      const { currency } = this;
      this.loading = true;
      new ApiClient("trade")
        .get("account/deposit_address/" + currency)
        .then(({ data }) => {
          this.loading = false;
          this.deposit_address = data.address;
        })
        .catch(() => (this.loading = false));
    },
    changeMarket($market) {
      const marketArray = $market.split("/");
      const market = marketArray.join("_");
      this.$store.commit("public/SYNC_EXCHANGE", market);
    }
  }
};
</script>
