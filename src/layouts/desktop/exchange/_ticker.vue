<template>
  <div class="ticker-info">
    <span class="ticker-name">{{ isAsk }}/{{ isBid }}</span>
    <div class="ticker-status">
      <div class="price">
        <span class="now-price" :class="getLastTrend" v-text="getLastPrice" />
        <span>≈ {{ getPrice_USD }} USD</span>
      </div>
      <dl class="change">
        <dt v-text="translation('status.change')" />
        <dt class="value" :class="getLastTrend" v-text="getChange" />
      </dl>
      <dl class="high">
        <dt v-text="translation('status.high')" />
        <dt class="value" v-text="getHighPrice" />
      </dl>
      <dl class="low">
        <dt v-text="translation('status.low')" />
        <dt class="value" v-text="getLowPrice" />
      </dl>
      <dl class="volume">
        <dt v-text="translation('status.24h_volume')" />
        <dt class="value" v-text="getVolume" />
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class App extends Vue {
  get isAsk() {
    return helpers.isAskSymbol().toUpperCase();
  }

  get isBid() {
    return helpers.isBidSymbol().toUpperCase();
  }

  get getLastTrend() {
    return helpers.getMarketPriceChange() >= 0 ? "text-up" : "text-down";
  }

  get getChange() {
    const ticker = this.$store.getters["public/getAllTickers"][
      helpers.isMarket()
    ];
    return ticker.price_change_percent;
  }

  get getLastPrice() {
    return helpers.getMarketLastPrice();
  }
  get getPrice_USD() {
    return helpers.getMarketLastUSD();
  }

  get getHighPrice() {
    const ticker = this.$store.getters["public/getAllTickers"][
      helpers.isMarket()
    ];
    const last_price = helpers.getMarketLastPrice();
    return last_price > Number(ticker.high)
      ? helpers.getMarketLastPrice()
      : Number(ticker.high).toFixed(helpers.pricePrecision());
  }

  get getLowPrice() {
    const ticker = this.$store.getters["public/getAllTickers"][
      helpers.isMarket()
    ];
    return helpers.getMarketLastPrice() < Number(ticker.low)
      ? helpers.getMarketLastPrice()
      : Number(ticker.low).toFixed(helpers.pricePrecision());
  }

  get getVolume() {
    const ticker = this.$store.getters["public/getAllTickers"][
      helpers.isMarket()
    ];
    return (
      Number(
        Number(ticker.volume).toFixed(helpers.pricePrecision()),
      ).toLocaleString() +
      " " +
      this.isBid.toUpperCase()
    );
  }

  public translation(message, data = {}) {
    helpers.translation("exchange." + message, data);
  }
}
</script>
