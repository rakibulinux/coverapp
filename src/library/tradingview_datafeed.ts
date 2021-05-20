import { TradeController } from '@/controllers';
import ApiClient from "@zsmartex/z-apiclient";
import ZSmartModel from "@zsmartex/z-eventbus";

let store;
const supportedResolutions = [
  "1",
  "3",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "D"
];

const history = {};

const config = {
  supported_resolutions: supportedResolutions
};

const createChannelString = symbolInfo => {
  const channel = symbolInfo.name.split(/[:/]/);
  return channel[0] + "/" + channel[1];
};

export default class DataFeed {
  onReady(cb) {
    cb(config);
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback) {
    const symbol_stub = {
      name: symbolName,
      description: "",
      type: "crypto",
      session: "24x7",
      timezone: "Etc/UTC",
      ticker: symbolName,
      minmov: 1,
      pricescale: Math.pow(10, TradeController.market.price_precision),
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "30", "60", "240"],
      supported_resolution: supportedResolutions
    };

    onSymbolResolvedCallback(symbol_stub);
  }

  async getBars(
    symbolInfo,
    resolution,
    from,
    to,
    onDataCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    if (resolution === "D" || resolution === "1D") resolution = 1440;
    if (firstDataRequest) {
      ZSmartModel.emit("tradingview-rending");
    }
    const payload = {
      period: resolution,
      time_from: from,
      time_to: to,
      limit: 2000
    };
    const url = "public/markets/" + TradeController.market.id + "/k-line";
    try {
      const { data } = await new ApiClient("trade").get(url, payload);
      let bars = data.map(el => ({
        time: el[0] * 1000,
        open: el[1],
        high: el[2],
        low: el[3],
        close: el[4],
        volume: el[5]
      }));

      bars = [];

      if (firstDataRequest) {
        history[symbolInfo.name] = { lastBar: bars.length ? bars[bars.length - 1] : null };
        ZSmartModel.emit("tradingview-ready");
      }
      
      onDataCallback(bars, { noData: !bars.length });
    } catch (error) {
      onErrorCallback(error);
      return error;
    }
  }

  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID) {
    const channelString = createChannelString(symbolInfo);
    const newSub = {
      channelString,
      subscribeUID,
      resolution,
      symbolInfo,
      lastBar: history[symbolInfo.name].lastBar,
      listener: onRealtimeCallback
    };
    TradeController.tradingview.stream = null;
    TradeController.tradingview.stream = newSub;
  }

  unsubscribeBars(subscriberUID) {
    // const { stream } = store.state.exchange.TradingView;
    // const subIndex = stream.findIndex(e => e.uid === subscriberUID);
    // if (subIndex === -1) return;
    // stream.splice(subIndex, 1);
    TradeController.tradingview.stream = null;
  }

  calculateHistoryDepth(resolution) {
    return resolution < 60
      ? { resolutionBack: "D", intervalBack: "1" }
      : undefined;
  }
}
