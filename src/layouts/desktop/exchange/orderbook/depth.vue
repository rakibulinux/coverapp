<template>
  <div class="depth" :class="side">
    <depth-overlay
      ref="overlay"
      :market="market"
      :side="side"
      :depth="depth()"
      :orders_best_range="orders_best_range"
    />

    <div :style="style">
      <depth-row
        v-for="(order, index) in depth()"
        :key="`${side}-${index}`"
        :side="side"
        :max-sum="maxSum"
        :market="market"
        :order="order"
        :ref="`depth-row-${index}`"
        @click="on_depth_clicked(order)"
        @mouseover="on_depth_hover(side, index)"
        @mouseleave="on_depth_leave_hover()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import TradeController from "@/controllers/trade";
import store from "@/store";
import DepthOverLay from "./depth-overlay.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";

interface MouseEvent {
  side?: MarketDepth["side"];
  index?: number;
  hover: boolean;
}

@Component({
  components: {
    "depth-row": () => import("./depth-row.vue"),
    "depth-overlay": () => import("./depth-overlay.vue")
  }
})
export default class MarketDepth extends Vue {
  @Prop() readonly side!: "asks" | "bids";

  uuid_callback: string;

  $refs!: {
    overlay: DepthOverLay;
  };

  get orderbook() {
    return TradeController.orderbook;
  }

  get overlay_mouse_event() {
    return this.$refs["overlay"].mouse_event;
  }

  get market() {
    const market_id = helpers.isMarket();

    return store.state.public.markets.find(market => market.id == market_id);
  }

  get maxSum() {
    let total = 0;
    this.depth().forEach(row => {
      total += Number(row.price * row.amount);
    });

    return total;
  }

  get style() {
    return this.side === "bids"
      ? "position: absolute;width: 100%;top: 0;"
      : "position: absolute;width: 100%;bottom: 0;";
  }

  depth() {
    let depth = this.orderbook.toArray(this.side);
    depth = depth.filter(order => order.price > 0 && order.amount > 0);
    depth = depth.splice(0, 50);

    return this.side === "bids" ? depth : depth.reverse();
  }

  orders_best_range(order_price: number) {
    const orders = this.depth();
    const index = orders.findIndex(ord => ord.price === order_price);
    let orders_with_range: { price: number; amount: number }[];

    if (index < 0) return;

    if (this.side === "bids") {
      orders_with_range =
        index === 0 ? [orders[0]] : orders.slice(0, index + 1);
    } else {
      orders_with_range =
        index === orders.length - 1
          ? [orders[orders.length - 1]]
          : orders.slice(index, orders.length);
    }

    return orders_with_range;
  }

  on_depth_clicked(order: { price: number; amount: number }) {
    const price = order.price;
    const orders_with_range = this.orders_best_range(order.price);

    ZSmartModel.emit(
      "depth-click",
      price,
      orders_with_range
        .map(order => order[1])
        .reduce((previousValue, currentValue) => previousValue + currentValue)
    );
  }

  on_depth_hover(side: MarketDepth["side"], index: number) {
    const element_hover = this.$refs[`depth-row-${index}`][0].$el;
    const DOMRect: DOMRect = element_hover.getBoundingClientRect();

    this.$refs["overlay"].create(index, DOMRect);
  }

  on_depth_leave_hover() {
    this.$refs["overlay"].destroy();
  }
}
</script>
