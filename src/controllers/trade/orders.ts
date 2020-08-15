import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";

export default abstract class OrdersController {
  async create_order(market_id: string, side: ZTypes.OrderSide, ord_type: ZTypes.OrdType = "limit", price: number, amount: number): Promise<ZTypes.Order> {
    try {
      const response = await new ApiClient("trade").post("market/orders", {
        market: market_id,
        side: side,
        price: price,
        volume: amount
      });
      helpers.runNotice("success", "Order has been placed");

      return response.data;
    } catch (error) {
      return error;
    }
  }

  async stop_order(order_id: number): Promise<ZTypes.Order> {
    try {
      const response = await new ApiClient("trade").post("market/orders/#{id}/cancel".replace("#{id}", order_id.toString()));
      helpers.runNotice("success", helpers.translation("message.order.canceled").toString());

      return response.data;
    } catch (error) {
      return error;
    }
  }

  async stop_orders(market_id?: string): Promise<number> {
    try {
      const response = await new ApiClient("trade").post("market/orders/cancel", { market: market_id });
      helpers.runNotice("success", "All market #{market} orders have been canceled".replace("#{market}", market_id));
      
      return response.data;
    } catch (error) {
      return error;
    }
  }
}
