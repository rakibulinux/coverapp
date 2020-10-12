import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import { ActionTree } from "vuex";

const actions: ActionTree<ExchangeState, RootState> = {
  async getMarketTrades({ commit }, market = helpers.isMarket()) {
    commit("REMOVE_TRADES_HISTORY");
    try {
      const url = "public/markets/" + market + "/trades";
      const { data } = await new ApiClient("trade").get(url);
      commit("MARKET_TRADES_HISTORY", data);
    } catch (error) {
      return error;
    }
  },
  dataFeed({ state, commit }, { type, trades, kline }: { type: string, trades: ZTypes.PublicTrade[], kline: number[] }) {
    const { stream } = state.TradingView;
    const sub = stream[0];
    if (!sub) return;
    if (!sub.lastBar) return;
    
    if (type === "trades") {
      for (const trade of trades) {
        const data = {
          trade_id: trade.id,
          time: new Date(trade.created_at).getTime(),
          volume: trade.amount,
          price: trade.price,
        };

        if (sub) {
          if (data.time < sub.lastBar.time) return;
          commit("UPDATE_BAR_CHART", data);
        }
      }
    } else if (type === "kline") {
      const data = {
        time: kline[0],
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
      };

      if (sub) {
        if (data.time * 1000 < sub.lastBar.time) return;
        commit("ADD_BAR_CHART", data);
      }
    }
  }
};

export default actions;
