<template>
  <dd class="empty">
    <div>
      <img src="@/assets/img/icon-control.png" width="50px" height="50px" />
      <div class="first" v-text="content" />
      <div
        v-if="allowSecond"
        class="second"
        v-text="$t('orders.empty_second')"
      />
    </div>
  </dd>
</template>

<script>
export default {
  props: {
    content: String | Number
  },
  computed: {
    allowSecond() {
      const { type } = this.$store.state.exchange.mine_control;
      return type === "open_orders" || type === "history_orders";
    }
  }
};
</script>
