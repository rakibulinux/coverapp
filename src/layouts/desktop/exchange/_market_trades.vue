<template>
  <z-card class="page-trade-trades" :bordered="false" title="Market trades">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="trade_data"
      :border="false"
    >
      <template slot="price" slot-scope="{ column, item }">
        <span
          :class="[
            'price',
            `text-${column.algin}`,
            getTrendType(item.taker_type)
          ]"
        >
          {{ getPrice(item.price) }}
        </span>
      </template>
      <template slot="amount" slot-scope="{ column, item }">
        <span :class="['amount', `text-${column.algin}`]">
          {{ getAmount(item.amount) }}
        </span>
      </template>
      <template slot="created_at" slot-scope="{ column, item }">
        <span :class="['time', `text-${column.algin}`]">
          {{ getDate(item.created_at) }}
        </span>
      </template>
    </z-table>
  </z-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";

@Component
export default class MarketTrades extends Vue {
  loading = false;
  isBid = helpers.isBidSymbol().toUpperCase();
  isAsk = helpers.isAskSymbol().toUpperCase();

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
      algin: "right",
      scopedSlots: true
    },
    {
      title: "Time",
      key: "created_at",
      class_name: "time",
      algin: "right",
      scopedSlots: true
    }
  ];

  get trade_data() {
    const { trades } = this.$store.state.exchange;
    return trades;
  }

  get price_precision() {
    return helpers.pricePrecision();
  }

  get amount_precision() {
    return helpers.amountPrecision();
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

  getPrice(price: string) {
    return Number(price).toFixed(this.price_precision);
  }

  getAmount(amount: string) {
    return Number(amount).toFixed(this.amount_precision);
  }

  getDate(created_at: number) {
    const date = new Date(created_at * 1000);
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
