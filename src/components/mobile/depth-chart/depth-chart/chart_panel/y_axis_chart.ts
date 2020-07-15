import utlis from "../utlis";
import AxisChartPanel from "./axis_chart";

export default class YAxisChartPanel extends AxisChartPanel {
  height: number;

  get width() {
    return this.config.yAxis.width;
  }

  constructor(
    parent: AxisChartPanel["$parent"],
    height: number
  ) {
    super();

    this.$parent = parent;
    this.height = height;

    this.canvas = utlis.createCanvas(this.height, this.width, this.parent_element);
    this.chart_ready = true;
  }

  draw_chart() {
    const context = this.context;
    const height = this.height;

    if (this.has_paint) context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.font = `${this.config.yAxis.tickText.size}px Arial`;

    this.draw_line(context, height);
    this.draw_ticks(context, height);
    this.has_paint = true;
  }

  draw_line(context: CanvasRenderingContext2D, height: number) {
    context.beginPath();
    context.strokeStyle = this.config.yAxis.axisLine.color;
    context.moveTo(0, 0);
    context.lineTo(0, height + 1);
    context.stroke();
  }

  draw_ticks(context: CanvasRenderingContext2D, height: number) {
    const gird_count = 4;

    for (let i = 0; i < gird_count + 1; i++) {
      const x = 2;
      const y = height - (height / gird_count) * i;
      if (y <= 10) {
        context.textBaseline = "top";
      } else {
        context.textBaseline = "bottom";
      }
      const tickConfig = {
        x: 0,
        y: y,
        height: 0,
        color: this.config.yAxis.tickText.color,
        font: `${this.config.yAxis.tickText.size}px Arial`,
      };
      this.render_tick(
        context,
        x,
        y,
        utlis.toPretty(((this.max_amount / gird_count) * i) * (1 + (this.config.chart.paddingTop / height))),
        "vertical",
        tickConfig
      );
    }
  }
}
