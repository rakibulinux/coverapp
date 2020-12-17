<template>
  <div class="assets-main balance">
    <div class="assets-head">
      <span class="total">
        <span class="label">{{ $t("assets.total_assets_calc") }}:</span>
        <span class="usdt">{{ getTotalUSDT }} USDT</span>
        <span class="usd">≈ {{ getTotalUSD }} USD</span>
      </span>
      <div v-if="mounted" class="assets-finder">
        <a-checkbox @click="hideSmallChange">
          {{ $t("assets.hidesmall") }}
          <a-tooltip placement="right">
            <template slot="title">
              <span>prompt text</span>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </a-checkbox>
        <div class="search">
          <input
            v-model="search"
            :placeholder="$t('table.search')"
            maxlength="9"
            type="text"
          />
          <i class="ivu-icon ivu-icon-ios-search-outline" />
        </div>
      </div>
    </div>
    <div class="assets-body">
      <div class="table-content">
        <dl class="head">
          <span class="coin" v-text="$t('table.coin')" />
          <span class="name" v-text="$t('table.name')" />
          <span class="total" v-text="$t('table.total')" />
          <span class="available" v-text="$t('table.available')" />
          <span class="locked" v-text="$t('table.locked')" />
          <span class="btc_val" v-text="$t('table.btc_val')" />
          <span class="text-center action" v-text="$t('table.action')" />
        </dl>
        <dd>
          <balance-row
            v-for="currency in CURRENCY"
            :key="currency"
            :currency_id="currency"
          />
        </dd>
      </div>
    </div>
  </div>
</template>

<script>
import { PublicController } from "@/controllers"
import * as helpers from "@zsmartex/z-helpers";
import _balance_row from "./modules/balance-row";

export default {
  components: {
    "balance-row": _balance_row
  },
  data: () => ({
    hidesmall: false,
    loading: false,
    search: "",
    mounted: false
  }),
  computed: {
    CURRENCY() {
      let currencies = helpers.CURRENCY();
      if (this.search)
        currencies = this.currency_filter_base(
          currencies,
          "search",
          this.search
        );
      if (this.hidesmall) {
        currencies = this.currency_filter_base(currencies, "hide small");
      }

      return currencies;
    },
    getTotalUSDT() {
      let value = 0;
      const currencies = PublicController.currencies;
      currencies.forEach(currency => {
        value += Number(new helpers.Balance(currency.id).getTotalUSDT());
      });
      return value.toFixed(2);
    },
    getTotalUSD() {
      const price = PublicController.global_price.USDT;
      if (price) return (price.USD * this.getTotalUSDT).toFixed(2);
      else return 0;
    }
  },
  mounted() {
    this.mounted = true;
  },
  methods: {
    hideSmallChange() {
      this.hidesmall = !this.hidesmall;
    },
    currency_filter_base(currencies, find_by, payload) {
      return currencies.filter(currency => {
        if (find_by === "search") {
          return currency.includes(payload);
        } else if (find_by === "hide small") {
          const btcAmount = new helpers.Balance(currency).getTotalBTC();
          return btcAmount >= 0.001;
        }
      });
    }
  }
};
</script>
