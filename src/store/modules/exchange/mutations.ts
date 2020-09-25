import config from "@/config";
import * as helpers from "@zsmartex/z-helpers";
import { MutationTree } from "vuex";

const mutations: MutationTree<ExchangeState> = {
  UPDATE_BAR_CHART(state, payload) {
    const { stream } = state.TradingView;
    const sub = stream[0];
    let { lastBar } = sub;
    if (!lastBar) return;
    let resolution: number = sub.resolution;
    if (sub.resolution.includes("D")) {
      resolution = 1440;
    } else if (sub.resolution.includes("W")) {
      resolution = 10080;
    }
    const coeff = resolution * 60;
    const rounded = Math.floor(payload.time / coeff) * coeff;
    const lastBarSec = lastBar.time / 1000;
    let _lastBar;
    if (rounded > lastBarSec) {
      _lastBar = {
        time: rounded * 1000,
        open: lastBar.close,
        high: lastBar.close,
        low: lastBar.close,
        close: payload.price,
        volume: payload.volume,
      };
    } else {
      if (payload.price < lastBar.low) lastBar.low = payload.price;
      else if (payload.price > lastBar.high) lastBar.high = payload.price;

      lastBar.volume += payload.volume;
      lastBar.close = payload.price;
      _lastBar = lastBar;
    }
    state.TradingView.stream[0].lastBar = _lastBar;
    state.TradingView.stream[0].listener(_lastBar);
  },
  ADD_BAR_CHART(state, payload) {
    const { stream } = state.TradingView;
    const sub = stream[0];
    let { lastBar } = sub;
    if (!lastBar) return;
    let { resolution } = sub;
    if (resolution.includes("D")) resolution = 1440;
    else if (resolution.includes("W")) resolution = 10080;
    const coeff = resolution * 60;
    const rounded = Math.floor(payload["time"] / coeff) * coeff;
    const lastBarSec = lastBar.time / 1000;
    let _lastBar;
    if (rounded > lastBarSec || payload["volume"] > lastBar.volume) {
      _lastBar = {
        time: rounded * 1000,
        open: payload["open"],
        high: payload["high"],
        low: payload["low"],
        close: payload["close"],
        volume: payload["volume"],
      };
    } else {
      if (payload["close"] < lastBar.low) lastBar.low = payload["close"];
      else if (payload["close"] > lastBar.high) lastBar.high = payload["close"];
      lastBar.volume = payload["volume"];
      lastBar.close = payload["close"];
      _lastBar = lastBar;
    }
    state.TradingView.stream[0].lastBar = _lastBar;
    state.TradingView.stream[0].listener(_lastBar);
  },
  ON_CANCELED_ORDER: (id) => {
    helpers.runNotice("success", helpers.translation("message.order.canceled").toString());
  },
  ADD_TRADE(state, { trades }) {
    state.trades.splice(100, 1);

    for (const trade of trades) {
      state.trades.unshift({
        id: trade.id,
        price: trade.price,
        amount: trade.amount,
        total: trade.total,
        market: trade.market,
        created_at: trade.created_at,
        taker_type: trade.taker_type,
      });

      document.title = `${trade.price} - ${(
        helpers.isAskSymbol() +
        "/" +
        helpers.isBidSymbol()
      ).toUpperCase()} - ${config.nameEX}`;
    }
  },
  MARKET_TRADES_HISTORY: (state, payload) => {
    state.trades = payload;
  },
  REMOVE_TRADES_HISTORY(state) {
    state.trades = [];
  },
  UPDATE_RESOLUTION(state, resolution) {
    state.TradingView.resolution = resolution;
    localStorage.setItem("tradingview.resolution", resolution);
  },
};

export default mutations;
