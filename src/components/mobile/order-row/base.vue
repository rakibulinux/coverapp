<template>
  <div :class="['order-row', `order-row-${order.side}`]">
    <circle-filled :filled="filled_percent" :side="order.side" />
    {{ order.id }}
    {{ order.created_at }}
  </div>
</template>

<script lang="ts">
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
}
</script>

<style lang="less">
.order-row {
  position: relative;
  display: block;
  width: 100%;
  padding: 8px 12px;

  .order-row-circle-filled {
    position: relative;

    .ant-progress-circle-trail {
      stroke: var(--disabled-color) !important;
    }

    .ant-progress-text {
      font-size: 7px;
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
