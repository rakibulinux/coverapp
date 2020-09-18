import ApiClient from "@zsmartex/z-apiclient";
import { applyMixins } from "../mixins";
import MineControl from "./mine_control";
import OrdersController from "./orders";
import OrderBook from "./order_book";

export class TradeController {
  constructor() {
    this.create_mine_control();
    this.orderbook = new OrderBook();
  }

  get_best_price(side: ZTypes.OrderSide | ZTypes.TakerType) {
    if (side === "buy") side = "bids";
    if (side === "sell") side = "asks";

    const depth = this.orderbook.toArray(side, 1);

    if (depth.length) return depth[0].price;
    return null;
  }

  get_depth(market_id: string, limit = 100) {
    return new ApiClient("trade").get("public/markets/" + market_id + "/depth", { limit: limit });
  }

  get_trades(market_id: string, limit = 100) {
    return new ApiClient("trade").get("public/markets/" + market_id + "/trades", { limit: limit });
  }
}

export interface TradeController extends OrdersController, MineControl {
  orderbook: OrderBook;
}
applyMixins(TradeController, [OrdersController, MineControl]);
const class_mounted = new TradeController();

export default class_mounted;
