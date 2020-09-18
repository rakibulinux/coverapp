import config from "@/config";
import * as helpers from "@zsmartex/z-helpers";
import { Store } from "vuex";
import ZSocket from "@/library/ZSocket";

const RESOLUTION_STREAM: { [key: string]: string } = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "30": "30m",
  "60": "1h",
  "1D": "1d",
  "1W": "1w"
};

export default (store: Store<RootState>) => {
  const public_socket = new ZSocket(config.api.ws.public, store, (socket: ZSocket) => {
    const payload = JSON.stringify({
      event: "subscribe",
      streams: ["global.tickers"]
    });

    socket.send(payload);
  });
  const private_socket = new ZSocket(
    config.api.ws.private,
    store,
    undefined,
    "private"
  );

  if (!(global as any).admin) {
    public_socket.connect();
  }
  store.subscribe(async ({ type, payload }) => {
    if (type === "websocket/unsubscribe") {
      public_socket.unsubscribe(payload);
    } else if (type === "websocket/subscribe") {
      public_socket.subscribe(payload);
    } else if (type === "exchange/UPDATE_RESOLUTION") {
      Object.values(RESOLUTION_STREAM).forEach(resolution => {
        const channel = helpers.isMarket() + ".kline-" + resolution;

        public_socket.unsubscribe(channel)
      });
      const channel = helpers.isMarket() + ".kline-" + RESOLUTION_STREAM[payload];

      public_socket.subscribe(channel);
    } else if (type === "user/AUTH_SUCCESS" && !(global as any).admin) {
      store.dispatch("user/getBalance");

      private_socket.connect();
    } else if (type === "user/LOGOUT") {
      if (private_socket.is_connected) private_socket.close();
    }
  });
};
