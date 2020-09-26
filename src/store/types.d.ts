import { OrderBookState } from "./modules/orderbook/types";

declare global {
  interface RootState {
    orderbook:              OrderBookState;
    exchange:               ExchangeState;
    public:                 PublicState;
    user:                   UserState;
    websocket:              WebSocketState;
  }
}
