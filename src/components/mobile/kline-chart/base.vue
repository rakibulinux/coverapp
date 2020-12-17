<template>
  <div :id="element_id"></div>
</template>

<script lang="ts">
import colors from "@/colors";
import ApiClient from "@zsmartex/z-apiclient";
import uuid from "uuid/v4";
import * as helpers from "@zsmartex/z-helpers";
import { init, Chart, KLineData } from "@zsmartex/klinecharts";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class KlineChart extends Vue {
  @Prop() readonly market_id!: string;
  @Prop() readonly period!: number;

  chart!: Chart;
  element_id = uuid();
  old_load_more_time = new Date().getTime();

  get price_precision() {
    return helpers.pricePrecision(this.market_id);
  }

  get amount_precision() {
    return helpers.amountPrecision(this.market_id);
  }

  mounted() {
    this.chart = init(this.element_id);

    this.chart.createTechnicalIndicator("VOL", 75, false);
    this.chart.createTechnicalIndicator("MACD", 50, false);

    this.chart.setPrecision(
      this.price_precision,
      this.amount_precision > 2 ? 2 : this.amount_precision
    );

    this.chart.setStyleOptions({
      candleStick: {
        bar: {
          style: "solid",
          upColor: colors["up-color"],
          downColor: colors["down-color"]
        },
        priceMark: {
          last: {
            upColor: colors["up-color"],
            downColor: colors["down-color"],
            text: {
              paddingBottom: 4,
              paddingLeft: 4,
              paddingRight: 4,
              paddingTop: 4,
              size: 8
            }
          }
        }
      },
      technicalIndicator: {
        bar: {
          upColor: colors["up-color"],
          downColor: colors["down-color"]
        },
        circle: {
          upColor: colors["up-color"],
          downColor: colors["down-color"]
        }
      },
      grid: {
        horizontal: {
          display: true,
          color: "#3c4a68",
          dashValue: [4, 4],
          style: "solid",
          size: 0.5
        },
        vertical: {
          display: true,
          color: "#3c4a68",
          dashValue: [4, 4],
          style: "solid",
          size: 0.5
        }
      },
      xAxis: {
        maxHeight: 20,
        minHeight: 20,
        axisLine: {
          color: "#3c4a68",
          display: true,
          size: 0.5
        },
        tickLine: {
          display: false
        },
        tickText: {
          position: "inside",
          margin: 6,
          color: "#728bb9",
          size: 8
        }
      },
      yAxis: {
        maxWidth: 50,
        minWidth: 50,
        axisLine: {
          color: "#3c4a68",
          display: true,
          size: 0.5
        },
        tickLine: {
          display: false
        },
        tickText: {
          margin: 10,
          position: "outside",
          color: "#728bb9",
          size: 8
        }
      },
      floatLayer: {
        crossHair: {
          horizontal: {
            text: {
              paddingBottom: 3,
              paddingLeft: 3,
              paddingRight: 3,
              paddingTop: 3,
              size: 8
            }
          },
          vertical: {
            text: {
              paddingBottom: 4,
              paddingLeft: 4,
              paddingRight: 4,
              paddingTop: 4,
              size: 8
            }
          }
        },
        prompt: {
          displayRule: "follow_cross",
          candleStick: {
            showType: "rect",
            labels: [
              { key: "timestamp", title: "Time" },
              { key: "open", title: "Open" },
              { key: "high", title: "High" },
              { key: "low", title: "Low" },
              { key: "close", title: "Close" },
              { key: "change", title: "Change%" },
              { key: "volume", title: "Volume" }
            ],
            rect: {
              borderSize: 1,
              borderColor: "#3c4a68",
              borderRadius: 0,
              fillColor: "#213150",
              paddingTop: 0,
              paddingBottom: 0,
              top: 14
            },
            text: {
              titleColor: "#fff",
              valueColor: "#728bb9",
              marginBottom: 0,
              marginLeft: 8,
              marginRight: 8,
              marginTop: 6,
              size: 8
            }
          },
          technicalIndicator: {
            text: {
              size: 8,
              marginTop: 4
            }
          }
        }
      },
      graphicMark: {},
      separator: {
        color: "#3c4a68",
        fill: true,
        size: 0.25
      }
    });

    this.get_chart_data();

    this.chart.loadMore(timestamp => {
      if (typeof timestamp !== "number") return;
      if (timestamp >= this.old_load_more_time) return;
      this.old_load_more_time = timestamp;

      this.get_chart_data(timestamp / 1000);
    });

    window.addEventListener("resize", () => {
      this.chart.resize();
    });
  }

  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.chart.resize();
    });
  }

  chart_data_list() {
    return this.chart.getDataList();
  }

  chart_first_data() {
    return this.chart_data_list()[0];
  }

  async get_chart_data(
    time_to = (new Date().getTime() / 1000).toFixedNumber(0),
    time_from?,
    limit = 100
  ) {
    const first_data = this.chart_data_list().length === 0;

    try {
      const { data } = await new ApiClient("trade").get(
        `public/markets/${this.market_id}/k-line`,
        {
          period: this.period,
          time_from,
          time_to,
          limit: limit
        }
      );

      if (!data.length) return;

      const kline_data: KLineData[] = data.map((kline: number[]) => ({
        timestamp: kline[0] * 1000,
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5]
      }));

      if (first_data) {
        this.chart.applyNewData(kline_data);
      } else if (
        this.chart_first_data().timestamp !== kline_data[0].timestamp
      ) {
        this.chart.applyMoreData(kline_data, true);
      }
    } catch (error) {
      return error;
    }
  }

  @Watch("period")
  onPeriodChanged() {
    this.chart.clearData();
    this.get_chart_data();
  }
}
</script>
