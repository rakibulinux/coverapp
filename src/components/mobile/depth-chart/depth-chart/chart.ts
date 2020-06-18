import colors from "@/colors";
import utlis from "./utlis";

export interface DepthData {
  price: number;
  total: number;
  volume: number;
}

export class Chart {
  gap = 5;
  paddingTop = 30;
  x_canvas_height = 20;
  //y_canvas_width = 20;
  element_id!: string;
  //element!: HTMLElement;

  main_canvas!: HTMLCanvasElement;
  gird_canvas!: HTMLCanvasElement;
  mark_canvas!: HTMLCanvasElement;
  x_canvas!: HTMLCanvasElement;
  y_canvas!: HTMLCanvasElement;
  args?: {
    maxAmount: number;
    scaleH: number;
    scaleW: number;
  };

  chart_ready = false;
  has_paint = false;

  buyStrokeColor = colors["up-color"];
  sellStrokeColor = colors["down-color"];
  buyFillColor = "rgb(23, 67, 78, 0.5)";
  sellFillColor = "rgba(69, 46, 67, 0.5)";

  depth_data: { buy: DepthData[]; sell: DepthData[] } = {
    buy: [],
    sell: [],
  };

  mouseEvent = {
    hover: false,
    offsetX: 0,
  };

  public valueMap = new Map<string[] | number[], DepthData>();

  constructor(element_id: string) {
    this.element_id = element_id;
    //this.element = document.getElementById(element_id);

    this.init_chart();
    this.chart_ready = true;
    this.draw_chart();
  }

  get element() {
    return document.getElementById(this.element_id);
  }

  get height() {
    return this.element.clientHeight - this.x_canvas_height;
  }

  get width() {
    return this.element.clientWidth;
  }

  get main_context() {
    const context = this.main_canvas.getContext("2d");

    return context;
  }

  get gird_context() {
    const context = this.gird_canvas.getContext("2d");

    return context;
  }

  get mark_context() {
    const context = this.mark_canvas.getContext("2d");

    return context;
  }

  get x_context() {
    const context = this.x_canvas.getContext("2d");

    return context;
  }

  get y_context() {
    const context = this.y_canvas.getContext("2d");

    return context;
  }

  get is_empty() {
    return !this.depth_data.buy.length || !this.depth_data.sell.length;
  }

  init_chart() {
    this.gird_canvas = this.create_canvas(this.height, this.width);
    this.main_canvas = this.create_canvas(this.height, this.width);
    this.mark_canvas = this.create_canvas(this.height, this.width);
    this.mark_canvas.style.zIndex = "1";
    this.x_canvas = this.create_canvas(this.x_canvas_height, this.width);
    this.y_canvas = this.create_canvas(this.x_canvas_height, this.width);

    this.x_canvas.style.position = "absolute";
    this.x_canvas.style.bottom = "0";

    this.mark_canvas.addEventListener(
      "touchstart",
      (event) => {
        this.handleMouseMove(event);
      },
      false
    );
    this.mark_canvas.addEventListener(
      "touchend",
      (event) => {
        this.handleMouseOut();
      },
      false
    );
    this.mark_canvas.addEventListener(
      "touchcancel",
      (event) => {
        this.handleMouseOut();
      },
      false
    );
    this.mark_canvas.addEventListener(
      "touchmove",
      (event) => {
        this.handleMouseMove(event);
      },
      false
    );
  }

  destroy() {
    this.chart_ready = false;
  }

  create_canvas(height, width) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const pixelRatio = utlis.getPixelRatio(ctx);
    canvas.height = height * pixelRatio;
    canvas.width = width * pixelRatio;
    canvas.style.height = height + "px";
    canvas.style.width = width + "px";

    ctx.scale(pixelRatio, pixelRatio);

    this.element.appendChild(canvas);

    return canvas;
  }

  resize(redraw = true) {
    const canvas_list = [
      "main_canvas",
      "gird_canvas",
      "mark_canvas",
      "x_canvas",
      "y_canvas",
    ];
    canvas_list.forEach((canvas_name) => {
      const canvas = this[canvas_name];
      const height =
        canvas_name === "x_canvas" ? this.x_canvas_height : this.height;
      const width = this.width;
      const ctx = canvas.getContext("2d");
      const pixelRatio = utlis.getPixelRatio(ctx);

      ctx.resetTransform();

      canvas.height = height * pixelRatio;
      canvas.style.height = height + "px";
      canvas.style.width = width + "px";
      canvas.width = width * pixelRatio;
      canvas.style.height = height + "px";
      canvas.style.width = width + "px";
      ctx.scale(pixelRatio, pixelRatio);
    });

    if (redraw) this.draw_chart();
  }

  draw_chart() {
    if (!this.chart_ready) return;
    const {
      depth_data,
      main_canvas,
      gird_canvas,
      main_context,
      gird_context,
      width,
      height,
    } = this;
    this.resize(false);
    this.args = this.calc_args(depth_data, width, height);
    this.draw_gird(gird_canvas, gird_context, width, height);

    if (!this.is_empty) {
      this.draw_main_canvas(
        main_canvas,
        main_context,
        depth_data,
        width,
        height,
        this.args
      );
      this.draw_x_line(depth_data);
      this.draw_y_line();
      this.has_paint = true;
    }
  }

  calc_args(data, width, height) {
    let maxAmount = 0;

    if (this.is_empty) return undefined;

    if (data.sell.length && data.buy.length) {
      maxAmount = Math.max(
        data.sell[data.sell.length - 1].total,
        data.buy[data.buy.length - 1].total
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

  draw_gird(canvas, context: CanvasRenderingContext2D, width, height) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const gird_count = 4;
    for (let count = gird_count; count > 1; count--) {
      context.lineWidth = 0.5;
      context.strokeStyle = "#3c4a68";
      context.beginPath();
      context.setLineDash([2, 2]);
      context.moveTo(
        count === gird_count
          ? width / gird_count
          : (width / gird_count) * count,
        0
      );
      context.lineTo(
        count === gird_count
          ? width / gird_count
          : (width / gird_count) * count,
        height
      );
      context.stroke();
      context.closePath();

      context.beginPath();
      context.setLineDash([]);
      context.moveTo(
        0,
        count === gird_count
          ? height / gird_count
          : (height / gird_count) * count
      );
      context.lineTo(
        width,
        count === gird_count
          ? height / gird_count
          : (height / gird_count) * count
      );
      context.stroke();
      context.closePath();
    }
  }

  draw_main_canvas(canvas, context, data, width, height, args) {
    if (!args) {
      throw new Error("args not ok");
    }

    if (this.has_paint) context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "transparent";
    context.fillRect(0, 0, width, height);

    let tempList = [];

    this.draw_chart_by_side(
      canvas,
      context,
      data["buy"],
      width,
      height,
      args,
      "buy",
      (list) => {
        tempList.push(list);
      }
    );
    this.draw_chart_by_side(
      canvas,
      context,
      data["sell"],
      width,
      height,
      args,
      "sell",
      (list) => {
        tempList.push(list);
      }
    );

    this.valueMap = new Map();
    tempList = tempList.sort((a, b) => a.x - b.x);
    tempList.forEach((item) =>
      this.valueMap.set([item.x, item.y, item.side], item.value)
    );
    if (this.mouseEvent.hover) {
      this.handleMouseMove({
        touches: [{ clientX: this.mouseEvent.offsetX }],
      });
    }
  }

  draw_chart_by_side(
    canvas,
    context,
    chartData: DepthData[],
    chartWidth,
    chartHeight,
    args,
    side: "buy" | "sell",
    callback?: Function
  ) {
    const { gap, paddingTop } = this;
    const width = chartWidth / 2;
    const height = chartHeight;

    const scaleW = width / chartData.length;

    context.beginPath();
    context.fillStyle = this[`${side}FillColor`];
    if (side === "sell") context.moveTo(width + gap, height);

    let x = 0;
    let y = 0;

    // let lastPoint = {
    //   x: side === "buy" ? 0 : width + gap,
    //   y: side === "buy" ? 0 : height
    // };

    chartData.forEach((item, i) => {
      if (side === "buy") {
        x = width - Number(i) * scaleW - gap;
      } else {
        x = width + Number(i) * scaleW + gap;
      }
      y = height - (item.total / args.maxAmount) * (height - paddingTop);

      if (side === "buy" && Number(i) === 0 && x > 0) {
        context.lineTo(x, height);
      }

      if (side === "buy" && x <= 2) {
        x = 2;
      } else if (x > chartWidth - 2) {
        x = chartWidth - 2;
      }

      // if (this.jagged) {
      //   context.lineTo(x, lastPoint.y);
      // }

      context.lineTo(x, y);
      //const lastPoint = { x, y };

      callback({
        x,
        y,
        value: item,
        side,
      });
    });

    context.lineWidth = 1;
    context.strokeStyle = this[`${side}StrokeColor`];
    context.lineTo(side === "buy" ? 0 : chartWidth + gap, y);
    context.lineTo(side === "buy" ? -gap : chartWidth + gap, height);
    //context.lineTo(side === "buy" ? width - gap : width + gap, height);
    context.stroke();
    context.fill();
    context.closePath();
  }

  draw_x_line(data) {
    const context = this.x_context;
    const { width } = this;

    if (this.has_paint) {
      context.clearRect(0, 0, this.x_canvas.width, this.x_canvas.height);
    }

    context.font = "8px Arial";
    context.fillStyle = colors["text-default-color"]; // Need change

    const buyLength = data.buy.length;
    const sellLength = data.sell.length;

    const equalWidth = width / 2;
    const step = 3;

    ["buy", "sell"].forEach((type) => {
      //context.textAlign = type ===  "buy" ? "right" : "start";
      this._xPagesFn(
        type === "buy" ? buyLength : sellLength,
        equalWidth,
        step,
        context,
        data,
        type,
        width
      );
    });
    this._xBestPagesFn(equalWidth, context, data, width);

    context.beginPath();

    context.strokeStyle = "#314363";
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.stroke();
    context.closePath();
  }

  public _xPagesFn(length, equalWidth, step, context, data, type, width) {
    if (length) {
      let x = 0;
      const y = 13;
      const scaleW = equalWidth / (length ? length : 1);
      const Divisor = Math.ceil(length / step);

      for (const i in data[type]) {
        const item = data[type][i];

        if (Number(i) % Divisor || Number(i) === 0) {
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
          height: 0,
          color: "#728bb9",
          font: "10px Arial",
        };
        this.render_tick(context, x, y, text, "horizontal", tickConfig);
      }
    }
  }

  public _xBestPagesFn(equalWidth, context, data, width) {
    let bestPrice = "0";
    let x = 0;
    const y = 13;
    const price_precision = 2; // add support market customize

    if (data.buy.length && data.sell.length) {
      bestPrice = Number((data.buy[0].price + data.sell[0].price) / 2).toFixed(
        price_precision
      );
    } else if (data.buy.length) {
      bestPrice = data.buy[0].price;
    } else if (data.sell.length) {
      bestPrice = data.sell[0].price;
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
      color: "#728bb9",
      font: "10px Arial",
    };
    this.render_tick(context, x, y, text, "horizontal", tickConfig);
  }

  draw_y_line() {
    const paddingTop = this.paddingTop;
    const height = this.height;
    const maxAmount = this.args.maxAmount;
    const context = this.y_context;
    const gird_count = 4;

    if (this.has_paint) context.clearRect(0, 0, this.width, height);

    context.font = "10px Arial";

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
        color: "#728bb9",
        font: "10px Arial",
      };
      this.render_tick(
        context,
        x,
        y,
        utlis.toPretty(((maxAmount / gird_count) * i) * (1 + (paddingTop / height))),
        "vertical",
        tickConfig
      );
    }

    context.beginPath();
    context.strokeStyle = "#728bb9";
    context.moveTo(0, 0);
    context.lineTo(0, this.height + 1);
    context.stroke();
  }

  render_tick(context, x, y, text, type, config) {
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

  handleMouseMove(event?) {
    if (!event) return;
    if (!event.touches) return;
    if (!event.touches.length) return;

    let offsetX: number = event.touches[0].clientX;

    if (offsetX) {
      this.mouseEvent.hover = true;
      this.mouseEvent.offsetX = offsetX;
    }
    if (offsetX === undefined && this.mouseEvent.hover) {
      offsetX = this.mouseEvent.offsetX;
    }
    const valueMap = this.valueMap;
    const maskContext = this.mark_context;

    const width = this.width;
    const height = this.height;
    // const Half = width / 2;

    if (this.has_paint) {
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
        maskContext.lineWidth = 1;
        maskContext.setLineDash([4, 4]);
        maskContext.clearRect(0, 0, width, height);

        //
        maskContext.beginPath();
        maskContext.moveTo(0, Number(y));
        maskContext.lineTo(width, Number(y));
        maskContext.stroke();
        maskContext.closePath();
        //

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
          false
        );

        maskContext.fillStyle = colorsDepth;
        maskContext.fillRect(leftPos, top, 5, heightOffset);
        maskContext.font = "13px Arial";
        maskContext.textAlign = "left";

        maskContext.fillStyle = colors["text-default-color"];
        maskContext.fillText("Price", textPos, top + marginTop);
        maskContext.fillStyle = colors["text-default-color"];
        maskContext.fillText(
          utlis.toThousand(result.price),
          textPos,
          top + marginTop + 16
        );
        maskContext.fillStyle = colors["text-default-color"];
        maskContext.fillText("Sum", textPos, top + marginTop + lineHeight + 24);
        maskContext.fillStyle = colors["text-default-color"];
        maskContext.fillText(
          utlis.toThousand(result.total),
          textPos,
          top + marginTop + lineHeight + 40
        );
        maskContext.closePath();
        break;
      }
    }
  }

  handleMouseOut() {
    const mark_context = this.mark_context;
    const width = this.width;
    const height = this.height;
    if (this.has_paint) {
      mark_context.clearRect(0, 0, width, height);
    }
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
}
