<template>
  <div class="kline" ref="kline" />
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";
import DataFeed from "./datafeed";
import { setTimeout } from "timers";

export default {
  props: {
    market: Array,
    config: Object,
    tickerName: Function,
    selectedTime: String | Number
  },
  data: () => ({
    timeKey: {
      "1m": 1,
      "5m": 5,
      "15m": 15,
      "30m": 30,
      "1H": 60,
      "2H": 120,
      "4H": 240,
      "6H": 360,
      "12H": 720,
      "1D": 1440,
      "1W": 10080
    },
    chartReady: false
  }),
  methods: {
    async newChartData() {
      this.setChartData([]);
      const resolution = this.timeKey[this.selectedTime];
      const to = parseInt(new Date() / 1000) + 1;
      const from = parseInt(to - 84600 * 7);
      const chartData = await new DataFeed().getBars(
        this.tickerName(this.market),
        resolution
      );

      this.setChartData(chartData);
    },

    onChartReady() {
      window.onresize = () => this.widget.resize();
      this.setConfig(this.config);
      this.chartReady = true;
    },

    updateChartData(payload) {
      const resolution = this.timeKey[this.selectedTime];
      const coeff = resolution * 60;
      const rounded = Math.floor(payload.ts / coeff) * coeff * 1000;
      let lastBar = this.widget.getLastBar();
      let _lastBar;

      if (rounded < lastBar.timestamp) return;
      if (rounded > lastBar.timestamp) {
        _lastBar = {
          open: lastBar.close,
          high: lastBar.close,
          low: lastBar.close,
          close: payload.price,
          volume: payload.volume,
          timestamp: rounded,
          turnover: payload.price * payload.volume
        };

        this.widget.addOrUpdateData(_lastBar);
      } else {
        if (payload.price < lastBar.low) lastBar.low = payload.price;
        else if (payload.price > lastBar.high) lastBar.high = payload.price;

        lastBar.volume += payload.volume;
        lastBar.close = payload.price;
        lastBar.turnover = payload.price * lastBar.volume;
        _lastBar = lastBar;

        this.widget.addOrUpdateData(_lastBar);
      }
    },

    addChartData(payload) {
      const resolution = this.timeKey[this.selectedTime];
      const coeff = resolution * 60;
      const rounded = Math.floor(payload["time"] / coeff) * coeff * 1000;
      let lastBar = this.widget.getLastBar();
      let _lastBar;

      if (rounded < lastBar.timestamp) return;
      if (rounded > lastBar.timestamp || payload["volume"] > lastBar.volume) {
        _lastBar = {
          timestamp: rounded,
          open: payload["open"],
          high: payload["high"],
          low: payload["low"],
          close: payload["close"],
          volume: payload["volume"],
          turnover: payload.price * payload.volume
        };

        this.widget.addOrUpdateData(_lastBar);
      } else {
        if (payload["close"] < lastBar.low) lastBar.low = payload["close"];
        else if (payload["close"] > lastBar.high)
          lastBar.high = payload["close"];
        lastBar.volume = payload["volume"];
        lastBar.close = payload["close"];
        lastBar.turnover = payload.price * lastBar.volume;
        _lastBar = lastBar;

        this.widget.addOrUpdateData(_lastBar);
      }
    },

    async onRender() {
      const { kline } = this.$refs;

      this.widget = ZSmartLibrary.assets.klinecharts.init(kline);
      await this.newChartData();
      this.onChartReady();

      ZSmartModel.on("new-trade", this.updateChartData);
      ZSmartModel.on("new-kline", this.addChartData);
    },
    setChartData(chartData) {
      this.widget.setDataList(chartData);
    },
    setConfig(config) {
      this.widget.setConfig(config);
    }
  },

  mounted() {
    this.onRender();
  },
  beforeDestroy() {
    ZSmartModel.remove("tooltipShowingData");
    if (this.chartReady) {
      this.setChartData([]);
    }
  },
  watch: {
    selectedTime() {
      this.newChartData();
    }
  }
};
</script>