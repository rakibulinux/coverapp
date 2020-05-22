<template>
  <z-card
    class="page-trade-trades"
    :bordered="false"
    title="Market trades"
  >
    <z-table :loading="loading" :columns="COLUMN" :data="trade_data" :border="false">
      <template slot="price" slot-scope="{ column, item }">
        <span :class="['price', `text-${column.algin}`, getTrendType(item.taker_type)]">
          {{ getPrice(item.price) }}
        </span>
      </template>
    </z-table>
  </z-card>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";

@Component
export default class MarketTrades extends Vue {
  loading = false;
  isBid = helpers.isBidSymbol().toUpperCase();
  isAsk = helpers.isAskSymbol().toUpperCase();
  pricePrecision = helpers.pricePrecision();
  amountPrecision = helpers.amountPrecision();

  COLUMN = [
    {
      title: `Price (${this.isBid})`,
      key: "price",
      algin: "left",
      scopedSlots: true
    },
    {
      title: `Amount (${this.isAsk})`,
      key: "amount",
      algin: "right"
    },
    {
      title: "Time",
      key: "created_at",
      class_name: "time",
      algin: "right"
    },
  ];

  get trade_data() {
    const { trades } = this.$store.state.exchange
    return trades.map(trade => {
      trade.price = this.getPrice(trade.price);
      trade.amount = this.getAmount(trade.amount);
      trade.created_at = this.fixTime(trade.created_at);

      return trade;
    });
  }

  mounted() {
    this.get_trades();
  }

  async get_trades() {
    this.loading = true;
    await this.$store.dispatch("exchange/getMarketTrades");
    this.loading = false;
  }

  getTrendType(taker_type) {
    return helpers.trendType(taker_type);
  }

  getPrice(price) {
    const { pricePrecision } = this;

    return Number(price).toFixed(pricePrecision);
  }

  getAmount(amount) {
    const { amountPrecision } = this;

    return Number(amount).toFixed(amountPrecision);
  }

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
</script>

<style lang="less">
.page-trade-trades {
  width: 50%;
  height: 100%;

  .z-table {
    &-row {
      height: 20px;
      line-height: 20px;
      padding-right: 11px;
      padding-left: 16px;
    }
  }
}
</style>
