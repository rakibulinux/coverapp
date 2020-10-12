<template>
  <div :id="element_id" />
</template>

<script lang="ts">
import uuid from "uuid/v4";
import store from "@/store";
import DataFeed from "@/library/DataFeed";
import config from "@/config";
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import { Vue, Component } from "vue-property-decorator";
import night_theme from "@/assets/css/tradingview/night";
import { cssjson, charting_library as TradingView } from "@/assets/js";

@Component({
  components: {
    "loading-page": () => import("@/layouts/loading-page.vue")
  }
})
export default class TradingViewChart extends Vue {
  element_id = uuid();

  public loading = false;
  public isAsk = helpers.isAskSymbol();
  public isBid = helpers.isBidSymbol();
  public symbol = [this.isAsk, this.isBid].join("/").toUpperCase();
  public widgetOptions = {
    debug: false,
    symbol: this.symbol,
    datafeed: new DataFeed(store),
    interval: localStorage.getItem("tradingview.resolution") || "15",
    container_id: this.element_id,
    library_path: "/charting_library/",
    timezone: config.timeZone,
    locale: "en",
    disabled_features: [
      "symbol_search_hot_key",
      "compare_symbol",
      "display_market_status",
      "go_to_date",
      "header_chart_type",
      "header_compare",
      "header_toolbar_save_load",
      "header_interval_dialog_button",
      "header_resolutions",
      "header_screenshot",
      "header_symbol_search",
      "header_undo_redo",
      "legend_context_menu",
      "show_hide_button_in_legend",
      "show_interval_dialog_on_key_press",
      "snapshot_trading_drawings",
      "symbol_info",
      "timeframes_toolbar",
      "use_localstorage_for_settings",
      "volume_force_overlay"
    ],
    enabled_features: [
      "dont_show_boolean_study_arguments",
      "hide_last_na_study_output",
      "move_logo_to_main_pane",
      "side_toolbar_in_fullscreen_mode",
      "keep_left_toolbar_visible_on_small_screens",
      "disable_resolution_rebuild"
    ],
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    user_id: "public_user_id",
    toolbar_bg: "transparent",
    fullscreen: false,
    autosize: true,
    studies_overrides: helpers.getStudiesOverrides(
      this.$store.state.exchange.theme
    ),
    overrides: helpers.getOverrides(this.$store.state.exchange.theme)
  };
  public studies = [];
  public tvWidget!: TradingView;

  get element() {
    return document.getElementById(this.element_id);
  }

  get chartType() {
    return Number(localStorage.getItem("tradingview.chartType")) || 1;
  }

  mounted() {
    this.renderChart();
    ZSmartModel.on("tradingview-ready", () => {
      this.loading = false;
    });
    ZSmartModel.on("tradingview-rending", () => {
      this.loading = true;
    });
  }

  public iframe() {
    return (this.element.querySelector(`iframe`) as HTMLIFrameElement)
      .contentWindow;
  }

  public renderChart() {
    ZSmartModel.emit("tradingview-rending");
    this.tvWidget = new TradingView(this.widgetOptions);
    const buttons = [
      { title: "Realtime", resolution: "1", chartType: 3 },
      { title: "1min", resolution: "1", chartType: 1 },
      { title: "5min", resolution: "5", chartType: 1 },
      { title: "15min", resolution: "15", chartType: 1 },
      { title: "30min", resolution: "30", chartType: 1 },
      { title: "1hour", resolution: "60", chartType: 1 },
      { title: "1day", resolution: "1D", chartType: 1 },
      { title: "1week", resolution: "1W", chartType: 1 }
    ];

    this.tvWidget.onChartReady(() => {
      if (!this.tvWidget) {
        return;
      }

      this.headerReady(buttons);
      this.createStudy();
      this.tvWidget.chart().setChartType(this.chartType);
      this.toggleStudy(this.chartType);
      this.appendStyle();
      ZSmartModel.emit("tradingview-ready");
    });
  }

  public appendStyle() {
    const css = cssjson().toCSS(night_theme);
    const iframe_document = this.iframe().document;
    const iframe_head = iframe_document.head;

    const style_element = iframe_document.createElement("style");
    style_element.setAttribute("type", "text/css");
    style_element.innerHTML = css;

    iframe_head.appendChild(style_element);
  }

  public async headerReady(buttons) {
    await this.tvWidget.headerReady();
    for (const config of buttons) {
      const button = this.tvWidget.createButton();
      button.setAttribute("title", config.title);
      button.textContent = config.title;
      button.addEventListener("click", () => {
        if (button.parentElement.classList.contains("actived")) {
          return false;
        }

        const actived_button = this.iframe().document.querySelector(".actived");
        if (actived_button) {
          this.iframe()
            .document.querySelector(".actived")
            .classList.remove("actived");
        }
        if (config.chartType != this.tvWidget.chart().chartType()) {
          this.tvWidget.chart().setChartType(config.chartType);
          this.toggleStudy(config.chartType);
        }
        this.tvWidget.chart().setResolution(config.resolution);
        store.commit("exchange/UPDATE_RESOLUTION", config.resolution);
        localStorage.setItem("tradingview.chartType", config.chartType);
        button.parentElement.classList.add("actived");
      });
      button.parentElement.classList.remove("actived");
      if (
        config.resolution === this.widgetOptions.interval &&
        config.chartType == this.chartType
      ) {
        button.parentElement.classList.add("actived");
      }
    }
  }

  public createStudy() {
    const studies = [
      {
        name: "Moving Average",
        length: [5],
        data: {
          "Plot.color": "rgb(132, 170, 213)"
        }
      },
      {
        name: "Moving Average",
        length: [10],
        data: {
          "Plot.color": "rgb(132, 170, 213)"
        }
      },
      {
        name: "Moving Average",
        length: [30],
        data: {
          "Plot.color": "rgb(85, 178, 99)"
        }
      },
      {
        name: "Moving Average",
        length: [60],
        data: {
          "Plot.color": "rgb(183, 36, 138)"
        }
      }
    ];
    for (const study of studies) {
      const id = this.tvWidget
        .chart()
        .createStudy(study.name, false, false, study.length, null, study.data);
      this.studies.push(id);
    }
  }

  public toggleStudy(chartType: number) {
    const state = chartType == 3 ? 0 : 1;
    for (let i = 0; i < this.studies.length; i++) {
      this.tvWidget
        .chart()
        .getStudyById(this.studies[i])
        .setVisible(state);
    }
  }
}
</script>
