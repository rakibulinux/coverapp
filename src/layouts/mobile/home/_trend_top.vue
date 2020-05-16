<template>
  <div class="trend-top">
    <div class="ex_table table_noscroll">
      <dt class="menu">
        <span class="text-left">
          <li @click="isGainers = true" :class="{ selected: isGainers }">Gainers</li>
        </span>
        <span class="text-left">
          <li @click="isGainers = false" :class="{ selected: !isGainers }">Losers</li>
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
          v-for="(data, index) in findTopMarkets"
          :key="index"
          @click="openMarketPreview(data.name.split('/'))"
        >
          <span class="text-left pair">
            <span>{{ data.base_unit.toUpperCase() }}</span>
            <span>/ {{ data.quote_unit.toUpperCase() }}</span>
          </span>
          <span
            class="text-left"
            :class="getTrend(percentToNumber(data.price_change_percent))"
          >{{ getPrice(data.last, data.name) }}</span>
          <span class="text-right rate">
            <div
              :class="getTrend(percentToNumber(data.price_change_percent), true)"
            >{{ data.price_change_percent }}</div>
          </span>
        </p>
      </dd>
    </div>
  </div>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";
import config from "@/config";

export default {
  props: {
    findTickers: Function,
    percentToNumber: Function,
    getTrend: Function,
    getPrice: Function
  },
  data: () => ({
    isGainers: true,
    findBy: "All"
  }),
  computed: {
    findTopMarkets() {
      let tickers = this.findTickers("market", this.findBy);

      tickers = tickers.sort(
        (low, high) =>
          this.percentToNumber(low.price_change_percent) -
          this.percentToNumber(high.price_change_percent)
      );

      if (this.isGainers) tickers = tickers.reverse();
      return tickers.slice(0, 5);
    },
    findAllBid() {
      const listBids = [
        "All",
        ...config.list_bid1,
        ...config.list_bid2
      ];

      return listBids.map(bid => ({
        value: bid,
        text: bid + " Market"
      }));
    }
  },
  methods: {
    openMarketPreview(market) {
      ZSmartModel.emit("open-market-preview", { methods: "setMarket", data: market });
    },
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
    },
    selectHandle(selectedVal, selectedIndex, selectedText) {
      this.findBy = selectedVal[0];
    }
  }
};
</script>