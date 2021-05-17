<template>
  <z-card class="page-trade-trades" :bordered="false" title="Market trades">
    <z-table
      :loading="loading"
      :columns="COLUMN"
      :data="trades"
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
import { TradeController } from "@/controllers";

@Component
export default class MarketTrades extends Vue {
  loading = false;
  
  get market() {
    return TradeController.market;
  }

  get COLUMN() {
    return [
      {
        title: `${this.$t("page.global.table.price")} (${this.market.quote_unit.toUpperCase()})`,
        key: "price",
        algin: "left",
        scopedSlots: true
      },
      {
        title: `${this.$t("page.global.table.amount")} (${this.market.base_unit.toUpperCase()})`,
        key: "amount",
        algin: "right",
        scopedSlots: true
      },
      {
        title: this.$t("page.global.table.time"),
        key: "created_at",
        class_name: "time",
        algin: "right",
        scopedSlots: true
      }
    ];
  }

  get trades() {
    return TradeController.trades;
  }

  get price_precision() {
    return helpers.pricePrecision();
  }

  get amount_precision() {
    return helpers.amountPrecision();
  }

  mounted() {
    this.get_public_trades();
  }

  async get_public_trades() {
    this.loading = true;
    await TradeController.get_public_trades(this.market.id);
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
      padding-right: 11px;
      padding-left: 16px;
    }
  }
}
</style>
