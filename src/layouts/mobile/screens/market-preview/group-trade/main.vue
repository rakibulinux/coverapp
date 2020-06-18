<template>
  <div class="group-trade">
    <cube-tab-bar v-model="selected" show-slider class="head-bar">
      <cube-tab
        v-for="item in tabs"
        :label="item.label"
        :key="item.label"
        class="picker"
      >
        {{ item.text }}
      </cube-tab>
    </cube-tab-bar>

    <cube-tab-panels v-model="selected">
      <cube-tab-panel
        v-for="item in tabs"
        :key="item.label"
        :label="item.label"
      >
        <order-book
          v-if="item.label === 'orderbook'"
          :getPrice="getPrice"
          :getAmount="getAmount"
        />
        <trades
          v-else
          :getPrice="getPrice"
          :getAmount="getAmount"
          :getTime="getTime"
        />
      </cube-tab-panel>
    </cube-tab-panels>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    trades: () => import("./trades.vue"),
    "order-book": () => import("./orderbook")
  }
})
export default class GroupTrade extends Vue {
  @Prop() readonly getPrice!: (price: number) => string;
  @Prop() readonly getAmount!: (amount: number) => string;
  @Prop() readonly getTime!: (time: Date) => string;

  selected = "orderbook";

  tabs = [
    {
      label: "orderbook",
      text: "Book"
    },
    {
      label: "trades",
      text: "Market Trades"
    }
  ];
}
</script>
