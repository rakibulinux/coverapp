import colors from "@/colors";
import Canvas from "./canvas";
import { Config, Row } from "./config";
import utlis from "./utlis";

class OrderBookTable {
  element_id: string;
  config: Config;
  canvas: Canvas;
  data: Row[] = [];
  lstTimeout: NodeJS.Timeout[] = [];

  constructor(element_id: string, config?: Config) {
    this.element_id = element_id;

    this.config = config;
  }

  get element() {
    return document.getElementById(this.element_id);
  }

  init() {
    this.canvas = new Canvas(this.element, this.config.height, this.config.width);
  }

  setData(data: Row[]) {
    this.data = data;
  }

  async draw_table() {
    for (const to of this.lstTimeout) {
      clearTimeout(to);
    }

    const context = this.canvas.context;
    utlis.clearCanvas(context, this.canvas.canvas)

    for (let index = 0; index < this.data.length; index++) {
      const row = this.data[index];
      const y = (index) * this.config.line_height;

      fillRect(
        context,
        0,
        y,
        row.backgroundWidth,
        this.config.line_height,
        row.backgroundColor
      );

      for await (const column of this.config.columns) {
        const x = column.x;

        context.beginPath();
        context.font = `500 ${column.fontSize}px Arial`;
        context.fillStyle = row["change"] == true ? colors["icon-color"] : column.color;
        context.textAlign = column.align;
        context.fillText(row["fake"] ? "---" : row[column.key], x, y + 10 + 5);
        context.closePath();

        if (row["change"]) {
          const to = setTimeout(() => {
            // fillRect(
            //   context,
            //   0,
            //   y,
            //   row.backgroundWidth,
            //   this.config.line_height,
            //   row.backgroundColor
            // );

            context.beginPath();
            context.font = `500 ${column.fontSize}px Arial`;
            context.textAlign = column.align;
            context.fillStyle = column.color;
            context.fillText(row["fake"] ? "---" : row[column.key], x, y + 10 + 5);
            context.closePath();
          }, 150);

          this.lstTimeout.push(to)
        }
      }
    }
  }
}

function fillRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
  context.beginPath();
  context.clearRect(x, y, 320, height);
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
  context.closePath();
}

export default OrderBookTable;
