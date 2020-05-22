<template>
  <div id="depth_chart">
    <canvas ref="chart" class="chart" :width="width" :height="height"></canvas>
    <canvas
      ref="chartMask"
      class="chart-mask"
      :width="width"
      :height="height"
      @mousemove="handleMouseMove"
      @mouseout="handleMouseOut"
    >
    </canvas>
    <canvas
      ref="xChart"
      class="chart-x"
      :width="width"
      height="30px"
      :style="xStyles"
    ></canvas>
    <canvas
      ref="yChart"
      class="chart-y"
      width="60px"
      :height="wrapHeight"
      :style="yStyles"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import colors from "@/colors";
import utils from "./utlis";

interface ValueMapKey {}

@Component
export default class DepthChart extends Vue {
  @Prop() public readonly wrapHeight!: number;
  @Prop() public readonly wrapWidth!: number;
  @Prop({ default: "#17434e" }) public readonly buyFillColor!: string;
  @Prop({ default: colors["up-color"] }) public readonly buyStrokeColor!: string;
  @Prop({ default: "#452e43" }) public readonly sellFillColor!: string;
  @Prop({ default: colors["down-color"] }) public readonly sellStrokeColor!: string;
  @Prop({ default: 5 }) public readonly gap!: number;
  @Prop({ default: false }) public readonly jagged!: boolean;
  @Prop({ default: 30 }) public readonly paddingTop!: number;

  public $refs!: {
    chart: HTMLCanvasElement;
    maskChart: HTMLCanvasElement;
    xChart: HTMLCanvasElement;
    yChart: HTMLCanvasElement;
  };

  public chart!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;
  public maskChart!: HTMLCanvasElement;
  public maskContext!: CanvasRenderingContext2D;
  public xChart!: HTMLCanvasElement;
  public xChartContext!: CanvasRenderingContext2D;
  public yChart!: HTMLCanvasElement;
  public yChartContext!: CanvasRenderingContext2D;
  public hasPaint = false;
  public args = null;
  public valueMap = new Map<
    string[] | number[],
    { price: number; volume: number; total: number }
  >();
  public mouseEvent = {
    offsetX: 0,
    hover: false,
  };

  get height() {
    return this.wrapHeight - 30;
  }

  get width() {
    return this.wrapWidth - 60;
  }

  get chartStyles() {
    return {
      width: this.width + "px",
      height: this.height + "px",
    };
  }

  get xStyles() {
    return {
      top: this.height + "px",
      left: 0,
    };
  }

  get yStyles() {
    return {
      top: 0,
      left: this.width + "px",
    };
  }

  get depth() {
    const SIDE = ["bids", "asks"];
    const depth = this.$store.state.exchange.depth;
    const data = { buy: [], sell: [] };

    for (const side of SIDE) {
      let total = 0;
      depth.toArray(side).forEach((row) => {
        const item = {
          price: null,
          volume: null,
          total: null,
        };

        total = Number(total + row.data);
        item.price = row.key;
        item.volume = row.data;
        item.total = Number(total.toFixed(4));

        data[side === "bids" ? "buy" : "sell"].push(item);
      });
    }

    return {
      buy: data.buy,
      sell: data.sell,
    };
  }

  get chartData() {
    const data = this.depth;

    return data;
  }

  get isEmptyData() {
    return utils.isEmpty(this.chartData);
  }

  public mounted() {
    this.$nextTick(() => {
      this._initChart();
    });
  }

  public beforeDestroy() {
    this._resetChart();
  }

  public _initChart() {
    if (!this.wrapHeight && !this.wrapWidth) { return; }
    this.chart = this.$refs.chart;
    this.context = utils.getContext2D(this.chart);
    this.maskChart = this.$refs.chartMask;
    this.maskContext = utils.getContext2D(this.maskChart);
    this.xChart = this.$refs.xChart;
    this.xChartContext = utils.getContext2D(this.xChart);
    this.yChart = this.$refs.yChart;
    this.yChartContext = utils.getContext2D(this.yChart);

    this._drawChart(this.chartData);
  }
  public _resetChart() {
    this.chart = this.maskChart = this.xChart = this.yChart = null;
  }
  public _drawChart(data) {
    this.args = this._calcArgs(data, this.width, this.height);

    if (!this.isEmptyData) {
      const { context, width, height } = this;
      this._drawMainCanvas(context, data, width, height, this.args);
      this._drawXLine(data);
      this._drawYLine();
      this.hasPaint = true;
    }
  }
  public _calcArgs(data, width, height) {
    if (!this.isEmptyData) {
      let maxAmount = 0;
      if (data.sell.length && data.buy.length) {
        maxAmount = Math.max(
          data.sell[data.sell.length - 1].total,
          data.buy[data.buy.length - 1].total,
        );
      } else if (data.sell.length) {
        maxAmount = data.sell[data.sell.length - 1].total;
      } else if (data.buy.length) {
        maxAmount = data.buy[data.buy.length - 1].total;
      }
      const scaleH = maxAmount / height;
      const scaleW = width / 2 / data.sell.length;

      return {
        maxAmount,
        scaleH,
        scaleW,
      };
    }

    return null;
  }
  public _drawMainCanvas(context, data, width, height, args) {
    if (!args) {
      throw new Error("args not ok");
    }

    if (this.hasPaint) {
      context.clearRect(0, 0, width, height);
    }

    context.fillStyle = "transparent";
    context.fillRect(0, 0, width, height);

    const { maxAmount } = args;
    const paddingTop = this.paddingTop;
    const gap = this.gap;
    const equalWidth = width / 2;

    let tempList = [];
    let x = 0;
    let y = 0;
    let lastPoint = { x, y };
    const buyLength = data.buy.length;
    const sellLength = data.sell.length;

    if (buyLength) {
      const scaleW = equalWidth / (buyLength || 1);

      context.beginPath();
      context.fillStyle = this.buyFillColor;

      for (const i in data.buy) {
        const item = data.buy[i];

        x = equalWidth - Number(i) * scaleW - gap;
        y = height - (item.total / maxAmount) * (height - paddingTop);
        if (Number(i) === 0 && x > 0) {
          context.lineTo(x, height);
        }

        if (x <= 2) {
          x = 2;
        }

        tempList.push({
          x,
          y,
          value: item,
          side: "buy",
        });

        if (this.jagged) {
          context.lineTo(x, lastPoint.y);
        }

        context.lineTo(x, y);
        context.stroke();
        lastPoint = { x, y };
      }

      context.lineWidth = 4;
      context.strokeStyle = this.buyStrokeColor;
      context.lineTo(0, y);
      context.lineTo(0, height);
      context.lineTo(equalWidth - gap, height);
      context.stroke();
      context.fill();
      context.closePath();
    }

    if (sellLength) {
      const scaleW = equalWidth / (sellLength || 1);

      context.beginPath();
      context.fillStyle = this.sellFillColor;
      context.moveTo(equalWidth + gap, height);

      lastPoint = {
        x: equalWidth + gap,
        y: height,
      };

      for (const i in data.sell) {
        const item = data.sell[i];

        x = equalWidth + Number(i) * scaleW + gap;
        y = height - (item.total / maxAmount) * (height - paddingTop);

        if (x > width - 2) {
          x = width - 2;
        }

        tempList.push({
          x,
          y,
          value: item,
          side: "sell",
        });

        if (this.jagged) {
          context.lineTo(x, lastPoint.y);
        }

        context.lineTo(x, y);
        lastPoint = { x, y };
      }

      context.lineWidth = 4;
      context.strokeStyle = this.sellStrokeColor;
      context.lineTo(width + gap, y);
      context.lineTo(width + gap, height);
      context.lineTo(equalWidth + gap, height);
      context.stroke();
      context.fill();
      context.closePath();
    }

    this.valueMap = new Map();
    tempList = tempList.sort((a, b) => a.x - b.x);
    tempList.forEach((item) =>
      this.valueMap.set([item.x, item.y, item.side], item.value),
    );
    if (this.mouseEvent.hover) {
      this.handleMouseMove({});
    }
  }
  public _drawXLine(data) {
    const context = this.xChartContext;
    const { width } = this;

    if (this.hasPaint) {
      context.clearRect(0, 0, width, 100);
    }

    context.font = "12px Arial";
    context.fillStyle = colors["text-default-color"]; // Need change

    const buyLength = data.buy.length;
    const sellLength = data.sell.length;

    const equalWidth = width / 2;
    const step = width / 300;

    ["buy", "sell"].forEach((type) => {
      this._xPagesFn(
        type === "buy" ? buyLength : sellLength,
        equalWidth,
        step,
        context,
        data,
        type,
        width,
      );
    });
    this._xBestPagesFn(equalWidth, context, data, width);

    context.beginPath();

    context.strokeStyle = "#728bb9";
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.stroke();
    context.closePath();
  }
  public _xPagesFn(length, equalWidth, step, context, data, type, width) {
    if (length) {
      let x = 0;
      const y = 22;
      const scaleW = equalWidth / (length ? length : 1);
      const Divisor = Math.ceil(length / step);

      for (const i in data[type]) {
        const item = data[type][i];

        if (Number(i) % Divisor || Number(i) === 0 || Number(i) === 1) {
          continue;
        }

        const text = item.price;
        const textWidth = Math.floor(context.measureText(text).width);

        if (type === "sell") {
          x = equalWidth + Number(i) * scaleW - textWidth / 2 + this.gap;
        } else {
          x = equalWidth - Number(i) * scaleW - textWidth / 2 - this.gap;
        }

        if (x + textWidth >= width) {
          x = width - textWidth;
        }
        const tickConfig = {
          x: x + textWidth / 2,
          y: 1,
          height: 6,
          color: "#728bb9",
          font: "13px Arial",
        };
        this.renderTick(context, x, y, text, "horizontal", tickConfig);
      }
    }
  }
  public _xBestPagesFn(equalWidth, context, data, width) {
    if (length) {
      let bestPrice = 0;
      let x = 0;
      const y = 22;
      const price_precision = helpers.pricePrecision(); // add support market customize

      if (data.buy.length && data.sell.length) {
        bestPrice = Number(
          (data.buy[0].price + data.sell[0].price) / 2,
        ).toFixedNumber(price_precision);
      } else if (data.buy.length) {
        bestPrice = Number(data.buy[0].price).toFixedNumber(price_precision);
      } else if (data.sell.length) {
        bestPrice = Number(data.sell[0].price).toFixedNumber(
          price_precision,
        );
      }

      const text = bestPrice;
      const textWidth = Math.floor(context.measureText(text).width);

      x = equalWidth - textWidth / 2;

      if (x + textWidth >= width) {
        x = width - textWidth;
      }
      const tickConfig = {
        x: x + textWidth / 2,
        y: 1,
        height: 6,
        color: "#728bb9",
        font: "13px Arial",
      };
      context.font = "13px Arial";
      this.renderTick(context, x, y, text, "horizontal", tickConfig);
    }
  }
  public _drawYLine() {
    const paddingTop = this.paddingTop;
    const height = this.height - paddingTop;
    const maxAmount = this.args.maxAmount;
    const context = this.yChartContext;
    const seg = maxAmount / 11;

    if (this.hasPaint) {
      context.clearRect(0, 0, 60, this.wrapHeight);
    }

    context.font = "13px Arial";
    const numberTick = height / 70;

    for (let i = 0; i < numberTick; i++) {
      const x = numberTick;
      const y = height - ((seg * (i - 1)) / maxAmount) * height - 40 - 1;
      const tickConfig = {
        x: 1,
        y: y - 4,
        height: 6,
        color: "#728bb9",
        font: "13px Arial",
      };
      this.renderTick(
        context,
        x,
        y,
        utils.toPretty(seg * i),
        "vertical",
        tickConfig,
      );
    }

    context.beginPath();
    context.strokeStyle = "#728bb9";
    context.moveTo(0, 0);
    context.lineTo(0, this.height + 1);
    context.stroke();
  }
  public renderTick(context, x, y, text, type, config) {
    context.beginPath();
    context.lineWidth = 1;
    context.fillStyle = context.strokeStyle = config.color;

    if (type === "vertical") {
      context.moveTo(config.x, config.y);
      context.lineTo(config.height + config.x, config.y);
    } else {
      context.moveTo(config.x, config.y);
      context.lineTo(config.x, config.y + config.height);
    }

    context.stroke();
    context.fillText(text, x, y);
    context.closePath();
  }
  public handleMouseMove($event) {
    let { offsetX } = $event;
    if (offsetX) {
      this.mouseEvent.hover = true;
      this.mouseEvent.offsetX = offsetX;
    }
    if (offsetX === undefined && this.mouseEvent.hover) {
      offsetX = this.mouseEvent.offsetX;
    }
    const valueMap = this.valueMap;
    const maskContext = this.maskContext;

    const width = this.width;
    const height = this.height;
    // const Half = width / 2;

    if (this.hasPaint) {
      maskContext.clearRect(0, 0, width, height);
    }

    for (const key of valueMap.keys()) {
      const x = key[0];
      const y = key[1];
      const side = key[2];
      const result = valueMap.get(key);
      const colorsDepth =
        side === "buy" ? this.buyStrokeColor : this.sellStrokeColor;
      const colorsDepthArc =
        side === "buy" ? this.buyFillColor : this.sellFillColor;
      let isLeft = true;

      if (offsetX < x) {
        maskContext.strokeStyle = colorsDepth;
        maskContext.lineWidth = 2;
        maskContext.setLineDash([8]);
        maskContext.clearRect(0, 0, width, height);

        /*
          maskContext.beginPath();
          maskContext.moveTo(0, y);
          maskContext.lineTo(width, y);
          maskContext.stroke();
          maskContext.closePath();
          */

        maskContext.beginPath();
        maskContext.moveTo(Number(x), Number(y));
        maskContext.lineTo(Number(x), height);
        maskContext.stroke();
        maskContext.closePath();

        maskContext.beginPath();
        // maskContext.shadowBlur = 10;
        // maskContext.shadowColor = 'rgba(0, 0, 0, 0.8)';

        maskContext.fillStyle = colorsDepthArc;
        maskContext.arc(Number(x), Number(y), 10, 0, 2 * Math.PI);
        maskContext.fill();
        maskContext.closePath();

        maskContext.beginPath();
        maskContext.fillStyle = colorsDepth;
        maskContext.arc(Number(x), Number(y), 5, 0, 2 * Math.PI);
        maskContext.fill();
        maskContext.closePath();

        maskContext.beginPath();
        maskContext.fillStyle = "rgba(12, 15, 29, 0.75)";
        maskContext.font = "12px bold";

        const widthOffset = 165;
        const heightOffset = 100;
        const left = Number(x) - widthOffset / 2;
        let top = Number(y) - heightOffset - 12;

        // if(maxTextWidth + 20 > widthOffset) {
        //   widthOffset = maxTextWidth + 20;
        // }
        //
        // if(left < 0) {
        //   left = 0
        // }

        // if(left >= width - widthOffset) {
        //   left = width - widthOffset;
        // }

        if (top <= 0) {
          top = Number(y) + 10;
        }

        if (Number(x) + widthOffset >= width) {
          isLeft = false;
        } else {
          isLeft = true;
        }

        const marginLeft = 10;
        const marginTop = 24;
        const lineHeight = 20;
        const leftPos = left + widthOffset / 2;
        const leftPosAndMargin = left + marginLeft + widthOffset / 2 + 6;
        const rightPos = left - widthOffset / 2;
        const rightPosAndMargin = left - marginLeft + widthOffset - 206;
        const textPos = isLeft ? leftPosAndMargin : rightPosAndMargin;

        // maskContext.fillRect(left, top, widthOffset, heightOffset);
        this.drawRoundedRect(
          maskContext,
          isLeft ? leftPos : rightPos,
          top,
          widthOffset,
          heightOffset,
          4,
          true,
          false,
        );

        maskContext.fillStyle = colorsDepth;
        maskContext.fillRect(leftPos, top, 5, heightOffset);
        maskContext.font = "13px Arial";
        maskContext.textAlign = "left";

        maskContext.fillStyle = colors["text-default-color"];
        maskContext.fillText("Price", textPos, top + marginTop);
        maskContext.fillStyle = colors["text-default-color"];
        maskContext.fillText(
          utils.toThousand(result.price),
          textPos,
          top + marginTop + 16,
        );
        maskContext.fillStyle = colors["text-default-color"];
        maskContext.fillText("Sum", textPos, top + marginTop + lineHeight + 24);
        maskContext.fillStyle = colors["text-default-color"];
        maskContext.fillText(
          utils.toThousand(result.total),
          textPos,
          top + marginTop + lineHeight + 40,
        );
        maskContext.closePath();
        break;
      }
    }
  }
  public handleMouseOut() {
    const maskContext = this.maskContext;
    const width = this.width;
    const height = this.height;
    maskContext.clearRect(0, 0, width, height);
    this.mouseEvent.hover = false;
    this.mouseEvent.offsetX = 0;
  }
  public drawRoundedRect(ctx, x, y, width, height, r, fill, stroke) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.arcTo(x, y, x + r, y, r);

    if (fill) {
      ctx.fill();
    }

    if (stroke) {
      ctx.stroke();
    }

    ctx.restore();
  }

  @Watch("height")
  @Watch("width")
  @Watch("depth")
  public onChartResizeOrChange(height) {
    this._initChart();
  }
}
</script>

<style>
#depth_chart {
  position: relative;
}

#depth_chart canvas {
  position: absolute;
}
</style>
