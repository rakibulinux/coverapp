<template>
  <a-card
    id="mine_control"
    :bordered="false"
    :tab-list="tabList"
    :active-tab-key="type_control"
    @tabChange="onTabChange"
  >
    <div slot="extra" class="extra-action cancel-all">
      <a-button type="primary">
        Cancel All
      </a-button>
    </div>
    <open-orders
      v-if="type_control === 'open_orders'"
      :type_control="type_control"
    />
    <orders-history
      v-if="type_control === 'orders_history'"
      :type_control="type_control"
    />
    <trades-history
      v-if="type_control === 'trades_history'"
      :type_control="type_control"
    />
  </a-card>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import OpenOrders from "./control/open_orders.vue";
import OrdersHistory from "./control/orders_history.vue";
import TradesHistory from "./control/trades_history.vue";

export default {
  components: {
    "open-orders": OpenOrders,
    "orders-history": OrdersHistory,
    "trades-history": TradesHistory
  },
  data: () => ({
    tabList: [
      {
        key: "open_orders",
        tab: "Open Orders"
      },
      {
        key: "orders_history",
        tab: "History Orders"
      },
      {
        key: "trades_history",
        tab: "History Trades"
      }
    ]
  }),
  computed: {
    market: () => helpers.isMarket(),
    type_control: {
      get() {
        return this.$store.state.exchange.mine_control.type;
      },

      set(val) {
        return (this.$store.state.exchange.mine_control.type = val);
      }
    }
  },
  watch: {
    isMarket() {
      this.getData();
    }
  },
  mounted() {
    if (this.$store.state.exchange.mine_control.market === this.market) return;
    if (helpers.isAuth()) this.getData();
  },
  methods: {
    getData() {
      this.$store.dispatch("exchange/getOpenOrders", {
        state: "wait",
        market: helpers.isMarket(),
        size: 100
      });
      this.$store.dispatch("exchange/getOrdersHistory", {
        market: helpers.isMarket(),
        size: 100
      });
      this.$store.dispatch("exchange/getTradesHistory", {
        market: helpers.isMarket(),
        size: 100
      });
    },
    onTabChange(type) {
      this.type_control = type;
      this.$store.commit("exchange/SET_MINE_CONTROL_TYPE", type);
    },
    translation: (message, data = {}) =>
      helpers.translation("exchange." + message, data)
  }
};
</script>
