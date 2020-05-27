import storeReal from "@/store";
import ApiClient from "@zsmartex/z-apiclient";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";

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
  "D",
];

const history = {};

const config = {
  supported_resolutions: supportedResolutions,
};

const createChannelString = (symbolInfo) => {
  const channel = symbolInfo.name.split(/[:/]/);
  return channel[0] + "/" + channel[1];
};

const checkStore = (storeFake) => {
  if (!storeReal) {
    store = storeFake;
  } else {
    store = storeReal;
  }
};

export default class DataFeeds {
  constructor(storeFake) {
    checkStore(storeFake);
  }

  onReady(cb) {
    setTimeout(() => {
      cb(config);
    }, 0)
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
      pricescale: Math.pow(10, helpers.pricePrecision()),
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "30", "60", "240"],
      supported_resolution: supportedResolutions,
    };
    setTimeout(() => {
      onSymbolResolvedCallback(symbol_stub);
    }, 0);
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
      limit: 2000,
    };
    const url = "public/markets/" + helpers.isMarket() + "/k-line";
    try {
      const { data } = await new ApiClient("trade").get(url, payload);
      const bars = data.map((el) => ({
        time: el[0] * 1000,
        open: el[1],
        high: el[2],
        low: el[3],
        close: el[4],
        volume: el[5],
      }));

      if (firstDataRequest) {
        history[symbolInfo.name] = { lastBar: bars[bars.length - 1] };
        ZSmartModel.emit("tradingview-ready");
      }
      const payload_callback = data.length ? undefined : { noData: true };
      onDataCallback(bars, payload_callback);
    } catch (error) {
      onErrorCallback(error);
      ZSmartModel.emit("tradingview-error");
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
      listener: onRealtimeCallback,
    };
    store.state.exchange.TradingView.stream = [];
    store.state.exchange.TradingView.stream.push(newSub);
  }

  unsubscribeBars(subscriberUID) {
    const { stream } = store.state.exchange.TradingView;
    const subIndex = stream.findIndex(e => e.uid === subscriberUID);
    if (subIndex === -1) return;
    stream.splice(subIndex, 1);
  }

  calculateHistoryDepth(resolution) {
    return resolution < 60
      ? { resolutionBack: "D", intervalBack: "1" }
      : undefined;
  }
}
