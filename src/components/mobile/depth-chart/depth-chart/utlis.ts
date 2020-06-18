export default {
  getPixelRatio(ctx) {
    const backingStore = ctx.backingStorePixelRatio ||
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1
    return (window.devicePixelRatio || 1) / backingStore
  },
  getContext2D(element: HTMLCanvasElement) {
    if (element) {
      const context = element.getContext("2d")

      return context;
    }

    return null;
  },
  isEmpty(depth) {
    return !depth.buy.length || !depth.sell.length;
  },
  toPretty(num) {
    num = num || 0;
    if (num < 1000) {
      return num.toFixed(2);
    } else if (num < 1e6) {
      return (num / 1e3).toFixed(2) + " K";
    } else if (num < 1e7) {
      return (num / 1e6).toFixed(2) + " M";
    } else if (num < 1e9) {
      return (num / 1e6).toFixed(2) + " M";
    } else if (num < 1e10) {
      return (num / 1e9).toFixed(2) + " B";
    }
    return (num / 1e9).toFixed(0) + " B";
  },
  toThousand(num = 0) {
    if (typeof num === "undefined") {
      return "0";
    }
    return (num || 0).toString().replace(/\d+/, (n) => {
      const len = n.length;
      if (len % 3 === 0) {
        return n.replace(/(\d{3})/g, ",$1").slice(1);
      } else {
        return (
          n.slice(0, len % 3) + n.slice(len % 3).replace(/(\d{3})/g, ",$1")
        );
      }
    });
  },
  clearCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    //const w = canvas.width;
    //canvas.width = 1;
    //canvas.width = w;
  }
};
