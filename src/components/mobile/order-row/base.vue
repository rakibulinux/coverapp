<template>
  <div :class="['order-row', `order-row-${order.side}`]">
    <circle-filled :filled="filled_percent" :side="order.side" />
    <div class="order-row-col">
      <div class="created_at">{{ date }}</div>
      <div></div>
    </div>
    {{ order.price }}
    {{ order.executed_volume }}
    {{ order.origin_volume }}
    {{ order.ord_type }}
    {{ order.side }}
    <div class="order-row-col">
    </div>
    <div class="order-row-col">
    </div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "circle-filled": () => import("./circle-filled.vue")
  }
})
export default class OrderRow extends Vue {
  @Prop() readonly order: ZTypes.Order;

  get filled_percent() {
    const { executed_volume, origin_volume } = this.order;

    return (
      (Number(executed_volume) / Number(origin_volume)) *
      100
    ).toFixedNumber(2);
  }

  get date() {
    return helpers.getDate(this.order.created_at);
  }
}
</script>

<style lang="less">
.order-row {
  position: relative;
  display: flex;
  width: 100%;
  padding: 8px 12px;

  .order-row-circle-filled {
    position: relative;
    margin-right: 8px;

    .ant-progress-circle-trail {
      stroke: var(--disabled-color) !important;
    }

    .ant-progress-text {
      font-size: 7px;
    }
  }

  &-col {
    display: flex;
    flex: 1;

    .created_at {
      font-size: 8px;
      color: var(--color-gray);
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
