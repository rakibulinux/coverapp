<template>
  <div class="page-exchange-m">
    <div class="page-exchange-m-orders">
      <div class="page-exchange-m-orders-head">
        <div class="page-exchange-m-orders-head-title">Current Orders</div>
        <div
          class="page-exchange-m-orders-head-action"
          @click="open_orders_screen"
        >
          <a-icon type="profile" /> View Orders
        </div>
      </div>
      <mine-control-content :orders="open_orders.orders" />
    </div>

    <orders-screen ref="orders-screen" />
  </div>
</template>

<script lang="ts">
import TradeController from "@/controllers/trade";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "mine-control-content": () => import("./content.vue"),
    "orders-screen": () => import("@/views/mobile/screens/orders")
  }
})
export default class MineControl extends Vue {
  @Prop() readonly market: ZTypes.Market;

  $refs!: {
    [key: string]: any;
  };

  get open_orders() {
    return TradeController.open_orders;
  }

  get orders_history() {
    return TradeController.orders_history;
  }

  get authorized() {
    return helpers.isAuth();
  }

  mounted() {
    if (!this.authorized) return;

    this.getOrders();
    this.orders_history.updated = this.open_orders.updated = () => {
      this.$forceUpdate();
    };
  }

  getOrders() {
    ["open_orders", "orders_history"].forEach(
      async (type: "open_orders" | "orders_history") => {
        this[type].clear();

        this[type].market = this.market.id;
        await this[type].getData();

        this[type].realtime = true;
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
    );
  }

  open_orders_screen() {
    if (this.authorized) {
      this.open_screen("orders");
    } else {
      ZSmartModel.emit("need-login");
    }
  }

  open_screen(screen: string) {
    this.$refs[`${screen}-screen`].create();
  }
}
</script>
