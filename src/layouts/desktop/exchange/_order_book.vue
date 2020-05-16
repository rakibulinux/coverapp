<template>
  <a-card
    :bordered="false"
    class="orderbook ant-card-wider-padding ant-card-padding-transition"
  >
    <div slot="title" class="ch">
      <div
        :class="{ change_book: true, active: whShow === 'all-asks' }"
        @click="changeShow('all-asks')"
      >
        <img src="@/assets/img/book_asks.svg" />
      </div>
      <div
        :class="{ change_book: true, active: whShow === 'normal' }"
        @click="changeShow('normal')"
      >
        <img src="@/assets/img/book_avg.svg" />
      </div>
      <div
        :class="{ change_book: true, active: whShow === 'all-bids' }"
        @click="changeShow('all-bids')"
      >
        <img src="@/assets/img/book_bids.svg" />
      </div>
    </div>
    <div class="ex_table">
      <dt>
        <span class="text-left">{{ $t("table.price") }} ({{ isBid }})</span>
        <span class="text-right">{{ $t("table.amount") }} ({{ isAsk }})</span>
        <span class="text-right">{{ $t("table.sum") }} ({{ isBid }})</span>
      </dt>
      <dd :class="whShow">
        <div class="depth asks">
          <a-spin v-if="loading" size="large">
            <a-icon
              slot="indicator"
              type="loading"
              style="font-size: 24px"
              spin
            />
          </a-spin>
          <depth-book v-else side="asks" />
        </div>
        <div class="ticker-book">
          <div class="now-price" :class="getLastTrend()">
            {{ getLastPrice() }}
            <em class="price_usd">≈ {{ getPrice_USD() }} USD</em>
            <span class="change">{{ getChange() }}</span>
          </div>
        </div>
        <div class="depth bids">
          <a-spin v-if="loading" size="large">
            <a-icon
              slot="indicator"
              type="loading"
              style="font-size: 24px"
              spin
            />
          </a-spin>
          <depth-book v-else side="bids" />
        </div>
      </dd>
    </div>
  </a-card>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import orderbook from "./orderbook";

export default {
  name: "OrderBook",
  components: {
    "depth-book": orderbook
  },
  data: () => ({
    loading: false,
    whShow: "normal"
  }),
  computed: {
    market: () => helpers.isMarket(),
    isBid: () => helpers.isBidSymbol().toUpperCase(),
    isAsk: () => helpers.isAskSymbol().toUpperCase()
  },
  mounted() {
    this.get_depth();
  },
  methods: {
    async get_depth() {
      this.loading = true;
      this.$store.dispatch("exchange/getMarketDepth");
      this.loading = false;
    },
    getLastTrend: () =>
      helpers.getMarketPriceChange() >= 0 ? "text-up" : "text-down",
    getLastPrice: () => helpers.getMarketLastPrice(),
    getPrice_USD: () => helpers.getMarketLastUSD(),
    getChange() {
      const ticker = this.$store.getters["public/getAllTickers"][
        helpers.isMarket()
      ];
      if (ticker) return ticker.price_change_percent;
      else return "-.--%";
    },
    changeShow(wh) {
      this.whShow = wh;
    }
  }
};
</script>
