<template>
  <z-card
    id="mine_control"
    :bordered="false"
    :tab-list="tabList"
    :active-tab-key="type_control"
    @tabChange="onTabChange"
    class="page-trade-mine-control"
  >
    <div slot="extra" class="extra-action cancel-all">
      <a-button @click="cancel_all_order" type="primary">
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
  </z-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import store from "@/store";
import * as helpers from "@zsmartex/z-helpers";

@Component({
  components: {
    "open-orders": () => import("./control/open_orders.vue"),
    "orders-history": () => import("./control/orders_history.vue"),
    "trades-history": () => import("./control/trades_history.vue")
  }
})
export default class MineControl extends Vue {
  public tabList = [
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
  ];

  get market() {
    return helpers.isMarket();
  }

  get type_control() {
    return store.state.exchange.mine_control.type;
  }

  set type_control(value) {
    store.state.exchange.mine_control.type = value;
  }

  public mounted() {
    if (this.$store.state.exchange.mine_control.market === this.market) {
      return;
    }
    if (helpers.isAuth()) {
      this.getData();
    }
  }

  public getData() {
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
  }

  public cancel_all_order() {
    this.$store.dispatch("exchange/CANCEL_ALL_ORDER", {
      market: helpers.isMarket()
    });
  }

  public onTabChange(type) {
    store.commit("exchange/SET_MINE_CONTROL_TYPE", type);
  }

  public translation(message, data = {}) {
    return helpers.translation("exchange." + message, data);
  }
}
</script>

<style lang="less">
.page-trade-mine-control {
  .z-table {
    &-row {
      line-height: 20px;
    }
  }
}
</style>
