import { DepthData } from "../Chart";
import utlis from "../utlis";
import AxisChartPanel from "./axis_chart";

export default class XAxisChartPanel extends AxisChartPanel {
  width: number;

  get height() {
    return this.config.xAxis.height;
  }

  constructor(
    parent: AxisChartPanel["$parent"],
    width: number
  ) {
    super();

    this.$parent = parent;
    this.width = width;

    this.canvas = utlis.createCanvas(
      this.height,
      this.width,
      this.parent_element
    );
    this.canvas.style.position = "absolute";
    this.canvas.style.bottom = "0";

    this.draw_chart();
    this.chart_ready = true;
  }

  draw_chart() {
    const context = this.context;
    const width = this.width;

    if (this.has_paint) context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.draw_line(context, width);
    this.draw_ticks(context, width, 4);
    this.has_paint = true;
  }

  draw_line(context: CanvasRenderingContext2D, width: number) {
    context.strokeStyle = this.config.xAxis.axisLine.color;
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.stroke();
    context.closePath();
  }

  draw_ticks(
    context: CanvasRenderingContext2D,
    width: number,
    gird_count: number
  ) {
    context.font = `${this.config.xAxis.tickText.size}px Arial`;

    const depth_data = this.depth_data;
    const step = gird_count - 1;

    ["buy", "sell"].forEach((type: "buy" | "sell") => {
      if (!depth_data[type].length) return;

      this.draw_tick(
        context,
        width,
        depth_data[type],
        step,
        type
      )
    });

    this.draw_best_tick(context, width, depth_data);
  }

  draw_tick(context: CanvasRenderingContext2D, width: number, data: DepthData[], step: number, type: string) {
    const equalWidth = width / 2;
    const length = data.length;
    const gap = this.config.chart.gap;
    const y = this.config.xAxis.tickText.margin;
    const scaleW = equalWidth / (length ? length : 1);
    const Divisor = Math.ceil(length / step);
    let x = 0;

    for (const i in data) {
      const item = data[i];

      if (Number(i) % Divisor || Number(i) === 0) {
        continue;
      }

      const text = item.price.toString();
      const textWidth = Math.floor(context.measureText(text).width);

      if (type === "sell") {
        x = equalWidth + Number(i) * scaleW - textWidth / 2 + gap;
      } else {
        x = equalWidth - Number(i) * scaleW - textWidth / 2 - gap;
      }

      if (x + textWidth >= width) {
        x = width - textWidth;
      }
      const tickConfig = {
        x: x + textWidth / 2,
        y: 1,
        height: 0,
        color: this.config.xAxis.tickText.color,
        font: `${this.config.xAxis.tickText.size}px Arial`,
      };
      this.render_tick(context, x, y, text, "horizontal", tickConfig);
    }
  }

  draw_best_tick(context: CanvasRenderingContext2D, width: number, data: XAxisChartPanel["depth_data"]) {
    const equalWidth = width / 2;

    let bestPrice = "0";
    let x = 0;
    const y = this.config.xAxis.tickText.margin;
    const price_precision = this.price_precision; // add support market customize

    if (data.buy.length && data.sell.length) {
      bestPrice = Number((data.buy[0].price + data.sell[0].price) / 2).toFixed(
        price_precision
      );
    } else if (data.buy.length) {
      bestPrice = data.buy[0].price.toFixed(
        price_precision
      );
    } else if (data.sell.length) {
      bestPrice = data.sell[0].price.toFixed(
        price_precision
      );;
    } else {
      return;
    }

    const text = bestPrice;
    const textWidth = Math.floor(context.measureText(text).width);

    x = equalWidth - textWidth / 2;

    const tickConfig = {
      x: x + textWidth / 2,
      y: 1,
      height: 0,
      color: this.config.xAxis.tickText.color,
      font: `${this.config.xAxis.tickText.size}px Arial`,
    };
    this.render_tick(context, x, y, text, "horizontal", tickConfig);
  }
}
