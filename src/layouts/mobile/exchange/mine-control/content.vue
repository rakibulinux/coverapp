<template>
  <div class="page-exchange-m-orders-content">
    <order-row
      v-for="order in orders.slice(0, 10)"
      :key="order.id"
      :order="order"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "order-row": () => import("@/components/mobile/order-row")
  }
})
export default class MineControlContent extends Vue {
  @Prop() readonly orders!: ZTypes.Order[];

  get element() {
    return this.$el as HTMLElement;
  }

  mounted() {
    this.$nextTick(() => {
      this.set_content_height();
    });
  }

  set_content_height() {
    const DOMRect = this.element.getBoundingClientRect();

    this.element.style.height = `${document.body.clientHeight -
      50 -
      DOMRect.top}px`;
  }
}
</script>
