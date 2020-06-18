<template>
  <div class="trend-top">
    <div class="ex_table table_noscroll">
      <dt class="menu">
        <span class="text-left">
          <li @click="isGainers = true" :class="{ selected: isGainers }">
            Gainers
          </li>
        </span>
        <span class="text-left">
          <li @click="isGainers = false" :class="{ selected: !isGainers }">
            Losers
          </li>
        </span>
        <span class="text-right">
          <div class="other" @click="showPicker">
            Choose Markets
            <i class="ic-jiaohuan1" />
          </div>
        </span>
      </dt>
      <dd>
        <p
          v-for="market in findTopMarkets"
          :key="market.id"
          @click="openMarketPreview(market)"
        >
          <span class="text-left pair">
            <span>{{ market.base_unit.toUpperCase() }}</span>
            <span>/ {{ market.quote_unit.toUpperCase() }}</span>
          </span>
          <span
            class="text-left"
            :class="getTrend(market.price_change_percent)"
            >{{ getPrice(market.last, market.name) }}</span
          >
          <span class="text-right rate">
            <div :class="getTrend(market.price_change_percent, true)">
              {{ market.price_change_percent }}
            </div>
          </span>
        </p>
      </dd>
    </div>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";
import { Picker } from "cube-ui";
import ZSmartModel from "@zsmartex/z-eventbus";
import config from "@/config";

@Component
export default class TrendTop extends Mixins(MarketMixin) {
  picker!: Picker;

  isGainers = true;
  findBy = "All";

  get findTopMarkets() {
    let tickers = this.findTickers("market", this.findBy);

    tickers = tickers.sort(
      (low, high) =>
        this.percentToNumber(low.price_change_percent) -
        this.percentToNumber(high.price_change_percent)
    );

    if (this.isGainers) tickers = tickers.reverse();
    return tickers.slice(0, 5);
  }

  get findAllBid() {
    const listBids = ["All", ...config.list_bid1, ...config.list_bid2];

    return listBids.map(bid => ({
      value: bid,
      text: bid + " Market"
    }));
  }

  openMarketPreview(market) {
    ZSmartModel.emit("open-market-preview", {
      methods: "setMarket",
      data: market
    });
  }

  showPicker() {
    if (!this.picker) {
      this.picker = this.$createPicker({
        title: "Select Market",
        data: [this.findAllBid],
        onSelect: this.selectHandle,
        cancelTxt: "Cancel",
        confirmTxt: "Confirm"
      });
    }
    this.picker.show();
  }

  selectHandle(selectedVal, selectedIndex, selectedText) {
    this.findBy = selectedVal[0];
  }
}
</script>
