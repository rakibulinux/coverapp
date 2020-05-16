<template>
  <div class="group-trade">
    <tab-bar v-model="selected" show-slider class="head-bar">
      <tab v-for="(data, index) in menu" :key="index" :label="data.label" class="picker">
        <span class="text" v-text="data.text" />
      </tab>
    </tab-bar>
    <div class="content">
      <order-book
        v-if="selected === 'orderbook'"
        :market="market"
        :getPrice="getPrice"
        :getAmount="getAmount"
      />
      <trades
        v-else
        :market="market"
        :getPrice="getPrice"
        :getAmount="getAmount"
        :getTime="getTime"
      />
    </div>
  </div>
</template>

<script>
import { orderbook, trades } from "./modules";
import tabBar from "@/components/mobile/tab-bar.vue";
import tab from "@/components/mobile/tab.vue";

export default {
  props: {
    market: Array,
    getPrice: Function,
    getAmount: Function,
    getTime: Function
  },
  data: () => ({
    selected: "orderbook",
    menu: [
      {
        label: "orderbook",
        text: "Book"
      },
      {
        label: "trades",
        text: "Market Trades"
      }
    ]
  }),
  components: {
    trades,
    "order-book": orderbook,
    "tab-bar": tabBar,
    tab
  }
};
</script>