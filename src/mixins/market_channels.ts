import * as helpers from "@zsmartex/z-helpers";

const RESOLUTION_STREAM = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "30": "30m",
  "60": "1h",
  "1D": "1d",
  "1W": "1w"
};

export const MarketChannels = (market: string = helpers.isMarket()) => {
  const tradingview_resolution = localStorage.getItem(
    "tradingview.resolution"
  );

  return [
    "ob-inc",
    "trades",
    "kline-" + RESOLUTION_STREAM[tradingview_resolution]
  ].map(channel => [market, channel].join("."));
}
