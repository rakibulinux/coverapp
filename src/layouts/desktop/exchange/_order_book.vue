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
    <div class="z-table">
      <div class="z-table-head">
        <span class="text-left">{{ $t("table.price") }} ({{ isBid }})</span>
        <span class="text-right">{{ $t("table.amount") }} ({{ isAsk }})</span>
        <span class="text-right">{{ $t("table.sum") }} ({{ isBid }})</span>
      </div>
      <div :class="['z-table-content', type + '-type']">
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
      </div>
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
    await this.$store.dispatch("exchange/getMarketDepth");
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

<style lang="less">
.page-exchange .orderbook {
  width: 50%;
  height: 100%;
  margin-right: 4px;
  .now-price {
    font-size: 18px;
    width: 100%;
    .price_usd {
      font-size: 14px;
      font-style: normal;
      color: var(--color-gray);
    }
  }

  .z-table {
    &-content {
      .depth {
        height: calc(50% - 20px);
        overflow-y: hidden;
      }

      > div {
        position: relative;
        width: 100%;
        left: 0;
        transition: height 0.5s;
      }

      &.bids-type {
        .asks {
          height: 0;
        }
        .bids {
          height: calc(100% - 40px);
        }
      }
      &.asks-type {
        .bids {
          height: 0;
        }
        .asks {
          height: calc(100% - 40px);
        }
      }
    }

    &-row {
      opacity: 1;
      padding: 0;
      cursor: pointer;
      overflow: hidden;

      span {
        &:first-child {
          padding-left: 16px;
        }
        &:last-child {
          padding-right: 16px;
        }
      }

      &:hover {
        background-color: var(--selected-bg-color);
      }
    }
  }

  .ch {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
  }

  .change_book {
    border: 1px solid;
    position: relative;
    display: inline-block;
    border-radius: 3px;
    width: 24px;
    height: 24px;
    margin-right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    border-color: var(--border-color);
    &:hover,
    &.active {
      border-color: var(--selected-border-color);
    }
  }
}

.ticker-book {
  height: 40px;
  padding: 0 16px;
  line-height: 38px;
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  border: 1px solid;
  border-right: none;
  border-left: none;
  border-color: var(--border-color);
  .change {
    float: right;
    font-size: 14px;
  }
}
</style>
