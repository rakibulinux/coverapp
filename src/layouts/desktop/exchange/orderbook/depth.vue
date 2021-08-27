<template>
  <div class="depth" :class="side">
    <z-loading v-if="loading" />
    <depth-overlay
      ref="overlay"
      :side="side"
      :depth="depth"
      :orders_best_range="orders_best_range"
    />
    <v-stage :style="style" ref="stage" :config="{
      width: 320,
      height: depth.length * 20,
    }">
      <v-layer>
        <depth-row
          v-for="(order, index) in depth"
          :key="`${side}-${index}`"
          :side="side"
          :index="index"
          :max-sum="maxSum"
          :market_id="market.id"
          :order="order"
          :ref="`depth-row-${index}`"
        />
      </v-layer>
    </v-stage>
    <div class="depth-hover" :style="style">
      <depth-hover-row
        v-for="(_, index) in count"
        :key="index"
        :ref="`depth-row-${index}`"
        @click="on_depth_clicked(index)"
        @mouseover="on_depth_hover(index)"
        @mouseleave="on_depth_leave_hover()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import TradeController from "@/controllers/trade";
import DepthOverLay from "./depth-overlay.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import ZSmartModel from "@zsmartex/z-eventbus";

@Component({
  components: {
    "depth-row": () => import("./depth-row.vue"),
    "depth-overlay": () => import("./depth-overlay.vue"),
    "depth-hover-row": () => import("./depth-hover-row.vue")
  }
})
export default class MarketDepth extends Vue {
  @Prop() readonly side!: "asks" | "bids";

  count = 50;

  $refs!: {
    overlay: DepthOverLay;
  };

  get orderbook() {
    return TradeController.orderbook;
  }

  get loading() {
    return this.orderbook.loading;
  }

  get overlay_mouse_event() {
    return this.$refs["overlay"].mouse_event;
  }

  get market() {
    return TradeController.market;
  }

  get maxSum() {
    let i = 0;
    let total = 0;
    for (const row of this.depth) {
      if ((row as any).fake) {
        continue;
      }

      total += Number(row.price) * Number(row.amount);
      i++
      if (i >= 35) {
        break;
      }
    }

    return total;
  }

  get style() {
    return this.side === "bids"
      ? "position: absolute;width: 100%;top: 0;"
      : "position: absolute;width: 100%;bottom: 0;";
  }

  get depth() {
    let depth: any = this.orderbook.toArray(this.side);
    depth = depth.slice(0, this.count);
    const depth_size = depth.length;

    for (let index = 0; index <= this.count - depth_size; index++) {
      depth.push({
        fake: true,
      })
    }

    return this.side === "bids" ? depth : depth.reverse();
  }

  orders_best_range(index: number) {
    const orders = this.depth.filter(row => !row.fake);

    if (!orders.length) return [];

    let orders_with_range: { price: string; amount: string }[];

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

  on_depth_clicked(index: number) {
    const orders_with_range = this.orders_best_range(index);
    let price: string;

    if (this.side == "bids") {
      price = orders_with_range[orders_with_range.length - 1].price
    } else {
      price = orders_with_range[0].price
    }

    ZSmartModel.emit(
      "depth-click",
      price,
      orders_with_range
        .map(order => order.amount)
        .reduce((previousValue, currentValue) => (Number(previousValue) + Number(currentValue)).toFixed(this.market.amount_precision))
    );
  }

  on_depth_hover(index: number) {
    const element_hover = this.$refs[`depth-row-${index}`][1].$el;
    const DOMRect: DOMRect = element_hover.getBoundingClientRect();

    this.$refs["overlay"].create(index, DOMRect);
  }

  on_depth_leave_hover() {
    this.$refs["overlay"].destroy();
  }
}
</script>
