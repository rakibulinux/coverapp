<template>
  <z-content class="page-record">
    <div class="container">
      <ul class="order-menu">
        <router-link
          v-for="(data, index) in MENU"
          :key="index"
          tag="li"
          :to="data.url"
          :class="{
            selected: $store.state.public.path === data.url
          }"
        >
          <i :class="data.icon" />
          <span v-text="data.text" />
        </router-link>
      </ul>
      <router-view />
    </div>
  </z-content>
</template>

<script>
export default {
  data() {
    return {
      MENU: [
        {
          icon: "ic-view_list-",
          text: "Open Orders",
          url: "/exchange_record/open"
        },
        {
          icon: "ic-rili",
          text: "Order History",
          url: "/exchange_record/history"
        },
        {
          icon: "ic-rili",
          text: "Trade History",
          url: "/exchange_record/transaction"
        }
      ]
    };
  }
};
</script>
