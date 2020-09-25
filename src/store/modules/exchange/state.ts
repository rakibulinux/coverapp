
const state: ExchangeState = {
  trades: [],
  theme: "night",
  TradingView: {
    history: {},
    stream: [],
    resolution: "15"
  },
  mine_control: {
    open_orders: {
      data: [],
      config: {
        market: "",
        ready: false,
        loading: false,
        realtime: false,
      }
    },
    orders_history: {
      data: [],
      config: {
        market: "",
        ready: false,
        loading: false,
        realtime: false,
      }
    },
    trades_history: {
      data: [],
      config: {
        market: "",
        ready: false,
        loading: false,
        realtime: false,
      }
    }
  }
};

export default state;
