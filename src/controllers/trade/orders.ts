import { runNotice } from "@/mixins";
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import config from "@/config";

export default abstract class OrdersController {
  async create_order(market_id: string, side: ZTypes.OrderSide, ord_type: ZTypes.OrdType = "limit", price: number, amount: number): Promise<ZTypes.Order> {
    try {
      const response = await new ApiClient(config.finex ? "finex" : "trade").post("market/orders", {
        market: market_id,
        ord_type: ord_type,
        side: side,
        price: price,
        volume: amount
      });
      runNotice("success", "order.created");

      return response.data;
    } catch (error) {
      return error;
    }
  }

  async stop_order(id_or_uuid: number | string) {
    try {
      await new ApiClient(config.finex ? "finex" : "trade").post((config.finex ? "market/orders/cancel/#{id}" : "market/orders/#{id}/cancel").replace("#{id}", id_or_uuid.toString()));
      runNotice("success", "order.canceled");

      return true;
    } catch (error) {
      return false;
    }
  }

  async stop_orders(market_id?: string, side?: ZTypes.OrderSide) {
    try {
      await new ApiClient(config.finex ? "finex" : "trade").post("market/orders/cancel", { market: market_id, side: side });
      runNotice("success", "order.canceled.all", { market: market_id });

      return true;
    } catch (error) {
      return false;
    }
  }

  async get_orders(payload: { market: string; state?: ZTypes.OrderState; type?: ZTypes.OrderSide | ""; page?: number; limit?: number; time_from?: number; time_to?: number }) {
    if (!payload.page) payload.page = 1;
    if (!payload.limit) payload.limit = 100;

    return new ApiClient(config.finex ? "finex" : "trade").get("market/orders", payload);
  }

  async get_trades(payload: { market: string; type?: ZTypes.OrderSide; page?: number; limit?: number; time_from?: number; time_to?: number }) {
    if (!payload.page) payload.page = 1;
    if (!payload.limit) payload.limit = 100;

    return new ApiClient("trade").get("market/trades", payload);
  }
}
