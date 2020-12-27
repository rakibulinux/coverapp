<template>
  <div :class="['order-row', `order-row-${order.side}`]">
    <circle-filled :filled="filled_percent" :side="order.side" />
    
    <div class="order-row-info">
      <div class="market-name">{{ market.name }}</div>
      <div class="order-price-volume">
        <span>
          <div class="title">Volume</div>
          <div class="title">Price</div>
        </span>
        <span>
          <div class="value">
            <span class="executed">{{ getAmount(order.origin_volume - order.remaining_volume) }}</span>
            <span class="origin">/ {{ getAmount(order.origin_volume) }}</span>
          </div>
          <div class="value">{{ getPrice(order.price) }}</div>
        </span>
      </div>
    </div>

    <div class="order-row-action text-right">
      <div class="created_at">{{ getDate(order.created_at, true) }}</div>
      <div class="action-cancel">
        <button @click="cancel_order">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TradeController } from "@/controllers";
import { MarketMixin } from "@/mixins/mobile";
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "circle-filled": () => import("./circle-filled.vue")
  }
})
export default class OrderRow extends Mixins(MarketMixin) {
  @Prop() readonly order: ZTypes.Order;

  get market_id() {
    return this.order.market;
  }

  get filled_percent() {
    const { executed_volume, origin_volume } = this.order;

    return (
      (Number(executed_volume) / Number(origin_volume)) *
      100
    ).toFixedNumber(2);
  }

  cancel_order() {
    TradeController.stop_order(this.order.id);
  }
}
</script>

<style lang="less">
.order-row {
  position: relative;
  display: flex;
  width: 100%;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;

  .order-row-circle-filled {
    position: relative;
    margin-right: 12px;
    text-align: center;

    &.buy, &.buy .ant-progress-text {
      color: var(--up-color);
    }

    &.sell, &.sell .ant-progress-text {
      color: var(--down-color);
    }

    .type-side {
      font-size: 8px;
      margin-bottom: 4px;
    }

    .ant-progress-circle-trail {
      stroke: var(--border-color) !important;
    }

    .ant-progress-text {
      font-size: 7px;
    }
  }

  &-info {
    flex: 1;

    .title {
      color: var(--color-gray);
      font-size: 9px;
    }

    .order-price-volume {
      display: flex;
      line-height: 14px;

      span { 
        margin-right: 8px;
      }

      .executed {
        color: var(--color-gray);
        margin-right: 2px;
      }

      .origin {

      }
    }
  }

  &-action {
    position: relative;
    .created_at {
      font-size: 9px;
      color: var(--color-gray);
    }

    button {
      position: absolute;
      bottom: 0;
      right: 0;

      background-color: var(--border-color);
      border-radius: 2px;
      font-size: 8px;
      height: 16px;
      width: 40px;
    }
  }

  &-buy {
    .ant-progress-circle-path {
      stroke: var(--up-color) !important;
    }
  }

  &-sell {
    .ant-progress-circle-path {
      stroke: var(--down-color) !important;
    }
  }
}
</style>
