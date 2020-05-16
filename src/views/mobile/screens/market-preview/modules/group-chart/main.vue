<template>
  <div class="group-chart">
    <div class="head-bar">
      <div v-if="dataTooltip" class="tooltip-showing">
        <p class="price">
          <span
            v-for="data in kline.keyTooltip"
            :key="data"
            :class="getTrendKey(data)"
            v-text="getValue(data)"
          />
        </p>
        <p class="info">
          <span :class="getTrendKey('volume')">
            Change {{ getValue("change") }}
          </span>
          <span>Txn {{ getValue("volume") }}</span>
          <span
            class="timestamp"
            v-text="getDate(getValue('timestamp'), true)"
          />
        </p>
      </div>
      <tab-bar
        v-show="!dataTooltip"
        v-model="selected"
        show-slider
        slider-big
        class="chart-picker"
      >
        <tab class="picker time-picker" label="time-picker">
          <span v-if="selected !== 'time-picker'" class="text">
            {{ kline.selectedTime }}
            <i class="ic-arrow-caret-down" />
          </span>
          <a-dropdown
            v-else
            overlay-class-name="ant-dropdown-kline"
            :trigger="['click']"
            placement="bottomLeft"
          >
            <span :class="['text', { active: dropdownShowing }]">
              {{ kline.selectedTime }} <i class="ic-arrow-caret-down" />
            </span>
            <a-menu slot="overlay">
              <a-menu-item
                v-for="data in kline.keyTime"
                :key="data"
                :class="{
                  'ant-dropdown-menu-item-selected': kline.selectedTime === data
                }"
                @click="changeKlineTime(data)"
              >
                {{ data }}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </tab>
      </tab-bar>
    </div>
    <div class="charts">
      <kline-chart
        v-if="selected === 'time-picker' && checkedResolution"
        class="chart"
        :market="market"
        :config="kline.config"
        :ticker-name="tickerName"
        :selected-time="kline.selectedTime"
      />
    </div>
  </div>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";
import tabBar from "@/components/mobile/tab-bar.vue";
import tab from "@/components/mobile/tab.vue";
import kline from "./modules/kline";

export default {
  components: {
    "kline-chart": kline,
    "tab-bar": tabBar,
    tab
  },
  props: {
    market: Array,
    tickerName: Function,
    pricePrecision: Function,
    amountPrecision: Function,
    getTrend: Function,
    getDate: Function
  },
  data: () => ({
    checkedResolution: false,
    dropdownShowing: false,
    selected: "time-picker",
    kline: {
      selectedTime: "15m",
      config: {
        candle: { lastPriceMark: { display: false } },
        xAxis: { separatorLine: { display: true, style: "solid" } },
        yAxis: {
          position: "right",
          separatorLine: { display: false, style: "solid" },
          tickText: { display: false, position: "inside" }
        },
        grid: {
          display: true
        }
      },
      dataTooltip: null,
      keyTooltip: ["open", "high", "low", "close"],
      keyTime: [
        "1m",
        "5m",
        "15m",
        "30m",
        "1H",
        "2H",
        "4H",
        "6H",
        "12H",
        "1D",
        "1W"
      ]
    },
    resolutionBackEndKey: {
      "1m": "1m",
      "5m": "5m",
      "15": "15m",
      "30m": "30m", // minuets
      "1H": "1h",
      "2H": "2h",
      "4H": "4h",
      "6H": "6h",
      "12H": "12h", // hours
      "1D": "1d",
      "1W": "1w" // weeks
    },
    resolutionDefaultKey: {
      "1m": 1,
      "5m": 5,
      "15m": 15,
      "30m": 30,
      "1H": 60,
      "2H": 120,
      "4H": 240,
      "6H": 360,
      "12H": 720,
      "1D": "1D",
      "1W": "1W"
    }
  }),
  computed: {
    dataTooltip() {
      return this.kline.dataTooltip;
    }
  },
  mounted() {
    ZSmartModel.on(
      "tooltipShowingData",
      data => (this.kline.dataTooltip = data)
    );
    ZSmartModel.on("tooltipHide", data => (this.kline.dataTooltip = null));
    this.setSelectedTime();
    if (!localStorage.getItem("tradingview.resolution"))
      localStorage.setItem("tradingview.resolution", 15);
  },
  methods: {
    setSelectedTime() {
      const { resolutionDefaultKey } = this;
      const resolution = localStorage.getItem("tradingview.resolution");
      for (const i in resolutionDefaultKey) {
        if (Number(resolution) === resolutionDefaultKey[i]) {
          this.kline.selectedTime = i;
          this.checkedResolution = true;
        }
      }
    },
    getTrendKey(key) {
      const { dataTooltip } = this;
      if (dataTooltip.new[key] === dataTooltip.old.close) return;
      return this.getTrend(dataTooltip.new[key] > dataTooltip.old.close);
    },
    getValue(key) {
      const { dataTooltip } = this;
      const prefix = {
        open: "O",
        high: "H",
        low: "L",
        close: "C"
      };
      if (key === "timestamp") return dataTooltip.new[key];
      if (key === "change") return dataTooltip.new[key] + "%";
      if (key === "volume")
        return Number(dataTooltip.new[key]).toFixed(
          this.amountPrecision(this.market)
        );
      return (
        prefix[key] +
        " " +
        Number(dataTooltip.new[key]).toFixed(this.pricePrecision(this.market))
      );
    },
    changeKlineTime(value) {
      this.kline.selectedTime = value;
      ZSmartModel.emit("kline-change-time", value);
    },
    changeTypeChart(value) {
      this.selected = value;
    }
  }
};
</script>
