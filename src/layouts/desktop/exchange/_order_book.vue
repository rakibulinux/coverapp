<template>
  <z-card
    :bordered="false"
    class="orderbook ant-card-wider-padding ant-card-padding-transition"
  >
    <div slot="title" class="ch">
      <div
        v-for="(item, key) in type_list"
        :key="key"
        :class="{ change_book: true, active: type === key }"
        @click="change_type(key)"
      >
        <img :src="item" />
      </div>
    </div>
    <div class="ex_table">
      <dt>
        <span class="text-left">{{ $t("table.price") }} ({{ isBid }})</span>
        <span class="text-right">{{ $t("table.amount") }} ({{ isAsk }})</span>
        <span class="text-right">{{ $t("table.sum") }} ({{ isBid }})</span>
      </dt>
      <dd :class="type + '-type'">
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
  </z-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import book_asks_svg from "@/assets/img/book_asks.svg";
import book_avg_svg from "@/assets/img/book_avg.svg";
import book_bids_svg from "@/assets/img/book_bids.svg";

@Component({
  components: {
    "depth-book": () => import("./orderbook/_depth.vue")
  }
})
export default class App extends Vue {
  public loading = false;
  public type = "normal";

  public type_list = {
    asks: book_asks_svg,
    default: book_avg_svg,
    bids: book_bids_svg
  };

  get market() {
    return helpers.isMarket();
  }

  get isBid() {
    return helpers.isBidSymbol().toUpperCase();
  }

  get isAsk() {
    return helpers.isAskSymbol().toUpperCase();
  }

  public mounted() {
    this.get_depth();
  }

  public async get_depth() {
    this.loading = true;
    this.$store.dispatch("exchange/getMarketDepth");
    this.loading = false;
  }

  public getLastTrend() {
    return helpers.getMarketPriceChange() >= 0 ? "text-up" : "text-down";
  }

  public getLastPrice() {
    return helpers.getMarketLastPrice();
  }

  public getPrice_USD() {
    return helpers.getMarketLastUSD();
  }

  public getChange() {
    const ticker = this.$store.getters["public/getAllTickers"][
      helpers.isMarket()
    ];
    if (ticker) {
      return ticker.price_change_percent;
    }

    return "-.--%";
  }

  public change_type(type) {
    this.type = type;
  }
}
</script>
