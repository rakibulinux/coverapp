import ZSmartModel from "@zsmartex/z-eventbus";
import ApiClient from "@zsmartex/z-apiclient";
import { applyMixins } from "../mixins";
import MineControl from "./mine_control";
import OrdersController from "./orders";
import OrderBook from "./orderbook";
import Store, { IStore } from "./store";
import GettersSetters from "./getters_setters";
import config from '@/config';
import { PublicController } from '..';
import { runNotice } from "@/mixins";
import TradingView from "./tradingview";
import * as helpers from "@zsmartex/z-helpers";
import router from '@/router';

export class TradeController {
  constructor() {
    this.create_mine_control();
    this.orderbook = new OrderBook();
    this.store = Store;
    this.tradingview = new TradingView();

    ZSmartModel.on("page-ready", () => {
      this.market = PublicController.markets.find(market => market.id == (localStorage.getItem("market") || config.default_market));
    });
  }

  open_exchange(market_id: string, side?: ZTypes.OrderSide) {
    const market = PublicController.markets.find(market => market.id == market_id);

    if (this.market.id != market.id) {
      ZSmartModel.emit("exchange-render", market.id, this.market.id);
      this.market = market;
    }

    localStorage.setItem("market", this.market.id);
    if (router.currentRoute.fullPath.includes("/exchange")) return;

    const exchange_layout = localStorage.getItem("exchange_layout");
    const exchange_path = helpers.isMobile() ? "/m/exchange" : `/exchange/${exchange_layout}`;
    router.push({ path: exchange_path, query: { type: side } });
  }

  get_best_price(side: ZTypes.OrderSide | ZTypes.TakerType) {
    if (side === "buy") side = "bids";
    if (side === "sell") side = "asks";

    const depth = this.orderbook.toArray(side, 1);

    if (depth.length) return depth[0].price;
    return null;
  }

  get_depth(market_id: string, limit = 100) {
    return new ApiClient(config.finex ? "finex" : "trade").get("public/markets/" + market_id + "/depth", { limit: limit });
  }

  async get_public_trades(market_id: string, limit = 100) {
    try {
      const { data } = await new ApiClient("trade").get("public/markets/" + market_id + "/trades", { limit: limit });

      this.trades = data;
    } catch (error) {
      return error;
    }
  }

  add_trade(trade: ZTypes.PublicTrade) {
    this.trades.unshift({
      id: trade.id,
      price: trade.price,
      amount: trade.amount,
      total: trade.total,
      market: trade.market,
      created_at: trade.created_at,
      taker_type: trade.taker_type
    });

    this.trades.splice(100, 1);
  }

  get_deposits(payload?: { currency?: string; state?: string; time_from?: string; time_to?: string; limit?: number; page?: number; }) {
    if (!payload) payload = {};
    if (!payload.page) payload.page = 1;
    if (!payload.limit) payload.limit = 100;

    return new ApiClient("trade").get("account/deposits", payload);
  }

  get_withdraws(payload?: { currency?: string; state?: string; time_from?: string; time_to?: string; limit?: number; page?: number; }) {
    if (!payload) payload = {};
    if (!payload.page) payload.page = 1;
    if (!payload.limit) payload.limit = 100;

    return new ApiClient("trade").get("account/withdraws", payload);
  }

  async get_deposit_address(currency_id: string) {
    const { data } = await new ApiClient("trade").get(`account/deposit_address/${currency_id}`)

    return data;
  }

  async create_withdrawal(currency_id: string, amount: number, otp_code: string, address?: string, beneficiary_id?: string, callback?: (payload?: any) => void) {
    try {
      const { data } = await new ApiClient("applogic").post("account/withdraws", { address, beneficiary_id: beneficiary_id, currency: currency_id, amount, otp_code });
      runNotice("warning", "withdraw.created");

      if (callback) callback(data);
    } catch (error) {
      return error;
    }
  }

  async confirm_withdrawal(tid: string, confirmation_code: string, callback?: () => void) {
    try {
      await new ApiClient("applogic").post("account/withdraws/confirm", { tid, confirmation_code });
      runNotice("success", "withdraw.confirmed");

      if (callback) callback();
    } catch (error) {

      console.log(error)
      return error;
    }
  }

  async generate_withdrawal_code(tid: string, callback?: () => void) {
    try {
      await new ApiClient("applogic").post("account/withdraws/generate_code", { tid });
      runNotice("success", "withdraw.code");

      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async cancel_withdrawal(tid: string, otp_code: string, callback?: () => void) {
    try {
      await new ApiClient("applogic").post("account/withdraws/cancel", { tid, otp_code });
      runNotice("success", "withdraw.canceled");

      if (callback) callback();
    } catch (error) {
      return error;
    }
  }
}

export interface TradeController extends OrdersController, MineControl, GettersSetters {
  orderbook: OrderBook;
  store: IStore;
  tradingview: TradingView;
}
applyMixins(TradeController, [OrdersController, MineControl, GettersSetters]);
const class_mounted = new TradeController();

export default class_mounted;
