<template>
  <div class="orderbook">
    <div class="ex_table table_noscroll left-panel">
      <dt>
        <span class="text-left">Bid</span>
      </dt>
      <dd>
        <p
          v-for="data in depthBids"
          :key="data[0]"
          :style="{
            backgroundSize:
              ((data[1] / maxSum['asks']) * 100).toFixed(0) + '% 100%'
          }"
          class="bids"
        >
          <span class="text-left">{{ getAmount(data[1]) }}</span>
          <span class="text-right text-up">{{ getPrice(data[0]) }}</span>
        </p>
      </dd>
    </div>
    <div class="ex_table table_noscroll right-panel">
      <dt>
        <span class="text-left">Ask</span>
      </dt>
      <dd>
        <p
          v-for="data in depthAsks"
          :key="data[0]"
          :style="{
            backgroundSize:
              ((data[1] / maxSum['bids']) * 100).toFixed(0) + '% 100%'
          }"
          class="asks"
        >
          <span class="text-left text-down">{{ getPrice(data[0]) }}</span>
          <span class="text-right">{{ getAmount(data[1]) }}</span>
        </p>
      </dd>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    market: Array,
    getPrice: Function,
    getAmount: Function
  },
  data: () => ({
    maxSum: {
      bids: 0,
      asks: 0
    }
  }),
  computed: {
    //FIXME: add support logic in to this method
    depthAsks() {
      return [];
    },
    depthBids() {
      return [];
    }
  }
};
</script>
