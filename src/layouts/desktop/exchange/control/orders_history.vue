<template>
  <z-table :columns="COLUMN" :data="orders_data" :hover="false" :border="false">
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
        {{ getAmount(item.origin_volume) }}
      </span>
    </template>
    <template slot="filled" slot-scope="{ item, column }">
      <span :class="['filled', `text-${column.algin}`]">
        {{
          (100 - (item.remaining_volume / item.origin_volume) * 100).toFixed(2)
        }}
      </span>
    </template>
    <template slot="total" slot-scope="{ item, column }">
      <span :class="['total', `text-${column.algin}`]">
        {{ getTotal(item.price * item.origin_volume) }}
      </span>
    </template>
    <template slot="action" slot-scope="{ item, column }">
      <span :class="['action', `text-${column.algin}`]">
        <i
          v-if="item.state === 'wait'"
          class="ic-aui-icon-close"
          @click="$store.dispatch('exchange/CANCEL_ORDER', data.id)"
        />
      </span>
    </template>
  </z-table>
</template>

<script>
import { Component, Mixins } from "vue-property-decorator";
import MineControlMixin from "./mixin";

@Component
export default class OrdersHistory extends Mixins(MineControlMixin) {
  get COLUMN() {
    return [
      { title: "Date", key: "created_at", algin: "left" },
      { title: "Type", key: "ord_type", algin: "left" },
      { title: "Side", key: "side", algin: "left", scopedSlots: true },
      { title: "Price", key: "price", algin: "center", scopedSlots: true },
      {
        title: `Amount (${this.isAsk})`,
        key: "amount",
        algin: "right",
        scopedSlots: true
      },
      { title: "Filled%", key: "filled", algin: "right", scopedSlots: true },
      {
        title: `Total (${this.isBid})`,
        key: "total",
        algin: "right",
        scopedSlots: true
      },
      { title: ``, key: "action", algin: "right", scopedSlots: true }
    ];
  }

  get orders_data() {
    const data = this.mine_control_data.orders_history.data;

    return data.map(order => {
      order.created_at = this.getDate(order.created_at);

      return order;
    });
  }
}
</script>
