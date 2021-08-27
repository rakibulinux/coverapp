<template>
  <div class="depth" :class="side">
    <z-loading v-if="loading" />
    <depth-overlay
      ref="overlay"
      :side="side"
      :depth="depth"
      :orders_best_range="orders_best_range"
    />
    <div :style="style + 'display: flex;'" :id="id" />

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
import uuid from "uuid/v4";
import TradeController from "@/controllers/trade";
import DepthOverLay from "./depth-overlay.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import ZSmartModel from "@zsmartex/z-eventbus";
import OrderBookTable from "@/library/orderbook-table";
import colors from "@/colors";

@Component({
  components: {
    "depth-overlay": () => import("./depth-overlay.vue"),
    "depth-hover-row": () => import("./depth-hover-row.vue")
  }
})
export default class MarketDepth extends Vue {
  @Prop() readonly side!: "asks" | "bids";

  id = uuid();
  count = 50;
  table: OrderBookTable

  $refs!: {
    overlay: DepthOverLay;
  };

  depth_destroy = false;

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

  get depth(): { price: string; amount: string; fake: boolean; }[] {
    let depth: any = this.orderbook.toArray(this.side);
    depth = depth.slice(0, this.count);
    const depth_size = depth.length;

    for (let index = 0; index < this.count - depth_size; index++) {
      depth.push({
        fake: true,
      })
    }

    return this.side === "bids" ? depth : depth.reverse();
  }

  cloneArray(myArray: any[]) {
    return myArray.map(a => Object.assign({}, a));
  }

  async mounted() {
    this.table = new OrderBookTable(this.id, {
      height: 1000,
      width: 320,
      line_height: 20,
      columns: [
        {
          key: "price",
          color: this.side === "bids" ? colors["up-color"] : colors["down-color"],
          fontSize: 12,
          align: "left",
          x: 16,
        },
        {
          key: "amount",
          color: colors["text-default-color"],
          fontSize: 12,
          align: "right",
          x: (320 / 3 * 2) - 8,
        },
        {
          key: "total",
          color: colors["text-default-color"],
          fontSize: 12,
          align: "right",
          x: 320 - 16,
        }
      ]
    })

    this.table.init();

    while (true) {
      if (this.depth_destroy) {
        break;
      }

      if (!this.orderbook.loading) {
        this.drawDepth(this.cloneArray(this.depth));
        await new Promise(resolve => setTimeout(resolve, 200));
        this.start_depth_update();
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async start_depth_update() {
    let old_depth = this.cloneArray(this.depth);
    let old_sequence =  this.orderbook.sequence

    while (true) {
      if (this.depth_destroy) {
        break;
      }

      if (old_sequence < this.orderbook.sequence) {
        const new_depth = this.cloneArray(this.depth);
        const depth_diff = this.diffDepth(this.cloneArray(new_depth), this.cloneArray(old_depth));

        await this.drawDepth(depth_diff);
        old_sequence = this.orderbook.sequence
        old_depth = this.cloneArray(new_depth);
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  beforeDestroy() {
    this.depth_destroy = true;
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
    const element_hover = this.$refs[`depth-row-${index}`][0].$el;
    const DOMRect: DOMRect = element_hover.getBoundingClientRect();

    this.$refs["overlay"].create(index, DOMRect);
  }

  on_depth_leave_hover() {
    this.$refs["overlay"].destroy();
  }

  diffDepth(new_depth: MarketDepth["depth"], old_depth: MarketDepth["depth"]) {
    return new_depth.map(row => {
      const old_row = old_depth.find(old_row => old_row.price == row.price);
      if (old_row) {
        (row as any).change = row.amount != old_row.amount
      } else {
        (row as any).change = true;
      }

      return row;
    })
  }

  drawDepth(depth: MarketDepth["depth"]) {
    this.table.setData(
      depth.map((row: any) => {
        row["price"] = Number(row["price"]).toFixed(this.market.price_precision);
        row["amount"] = Number(row["amount"]).toFixed(this.market.amount_precision);
        row["total"] = (Number(row["price"]) * Number(row["amount"])).toFixed(this.market.total_precision);
        row["backgroundWidth"] = 320 / 100 * Math.min((Number(row["total"]) / this.maxSum) * 100 * 3, 100);
        row["backgroundColor"] = this.side === "bids" ? colors["up-bg-color"] : colors["down-bg-color"];

        return row;
      })
    )

    this.table.draw_table();
  }
}
</script>
