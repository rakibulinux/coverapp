<template>
  <a-card
    id="market_trade"
    :bordered="false"
    title="Market trades"
    class="ant-card-wider-padding ant-card-padding-transition"
  >
    <div class="ex_table">
      <dt>
        <span class="text-left">{{ $t("table.price") }} ({{ isBid }})</span>
        <span class="text-right">{{ $t("table.amount") }} ({{ isAsk }})</span>
        <span class="text-right">{{ $t("table.time") }}</span>
      </dt>
      <dd v-if="!trades.length" class="empty">
        <div class="text-center">
          No Data
        </div>
      </dd>
      <a-spin v-if="loading" size="large">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
      <transition-group
        v-else
        class="trades"
        name="list"
        tag="dd"
        enter-active-class="animated fadeIn"
      >
        <p v-for="trade in $store.state.exchange.trades" :key="trade.id">
          <span :class="['text-left', getTrendType(trade.taker_type)]">
            {{ getPrice(trade.price) }}
          </span>
          <span class="text-right">{{ getAmount(trade.amount) }}</span>
          <span class="text-right">{{ fixTime(trade.created_at) }}</span>
        </p>
      </transition-group>
    </div>
  </a-card>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";

export default {
  data: () => ({
    loading: false
  }),
  computed: {
    trades() {
      return this.$store.state.exchange.trades;
    },
    isBid: () => helpers.isBidSymbol().toUpperCase(),
    isAsk: () => helpers.isAskSymbol().toUpperCase(),
    pricePrecision: () => helpers.pricePrecision(),
    amountPrecision: () => helpers.amountPrecision()
  },
  mounted() {
    this.get_trades();
  },
  methods: {
    async get_trades() {
      this.loading = true;
      await this.$store.dispatch("exchange/getMarketTrades");
      this.loading = false;
    },
    getTrendType: taker_type => helpers.trendType(taker_type),
    getPrice(price) {
      const { pricePrecision } = this;

      return Number(price).toFixed(pricePrecision);
    },
    getAmount(amount) {
      const { amountPrecision } = this;

      return Number(amount).toFixed(amountPrecision);
    },
    fixTime(created_at) {
      const date = new Date(created_at);
      return (
        ("00" + date.getHours()).slice(-2) +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2)
      );
    }
  }
};
</script>
