<template>
  <z-table
    :columns="COLUMN"
    :loading="loading"
    :data="trades_data"
    :hover="false"
    :border="false"
  >
    <template slot="side" slot-scope="{ item, column }">
      <span :class="['side', `text-${column.algin}`, getTrend(item.side)]">
        {{ item.side }}
      </span>
    </template>
    <template slot="price" slot-scope="{ item, column }">
      <span :class="['price', `text-${column.algin}`]">
        {{ getPrice(item.price) }}
      </span>
    </template>
    <template slot="amount" slot-scope="{ item, column }">
      <span :class="['amount', `text-${column.algin}`]">
        {{ getAmount(item.amount) }}
      </span>
    </template>
    <template slot="total" slot-scope="{ item, column }">
      <span :class="['total', `text-${column.algin}`]">
        {{ getTotal(item.price * item.amount) }}
      </span>
    </template>
  </z-table>
</template>

<script>
import { Component, Mixins } from "vue-property-decorator";
import MineControlMixin from "./mixin";

@Component
export default class TradesHistory extends Mixins(MineControlMixin) {
  name = "trades_history";

  get COLUMN() {
    return [
      { title: this.$t("table.date"), key: "created_at", algin: "left" },
      {
        title: this.$t("table.side"),
        key: "side",
        algin: "left",
        scopedSlots: true
      },
      { title: "Price", key: "price", algin: "center", scopedSlots: true },
      {
        title: `Amount (${this.isAsk})`,
        key: "amount",
        algin: "right",
        scopedSlots: true
      },
      {
        title: `Total (${this.isBid})`,
        key: "total",
        algin: "right",
        scopedSlots: true
      }
    ];
  }

  mounted() {
    this.mine_control.updated = () => {
      this.$forceUpdate();
    };
  }

  get trades_data() {
    const orders = this.mine_control.trades;

    return orders.map(order => {
      order.created_at = this.getDate(order.created_at);

      return order;
    });
  }
}
</script>
