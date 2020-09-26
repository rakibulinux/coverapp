import store from "@/store";
import TradeController from "@/controllers/trade";

export default class OrderBook {
  async fetch(market_id: string, limit?: number) {
    try {
      const { data } = await TradeController.get_depth(market_id, limit);
      const depth: { [key in ZTypes.TakerType]: string[][] } = data;
      this.clear();

      ["asks", "bids"].forEach((side: ZTypes.TakerType) => {
        depth[side].forEach(row => {
          const price = Number(row[0]);
          const amount = Number(row[1]);

          this.add(price, amount, side);
        })
      })
    } catch (error) {
      return error;
    }
  }

  add(price: number, amount: number, side: ZTypes.TakerType) {
    store.commit("orderbook/add", { price, amount, side });
  }

  remove(price: number, side: ZTypes.TakerType) {
    store.commit("orderbook/remove", { price, side });
  }

  toArray(side: ZTypes.TakerType, limit = 100) {
    return store.state.orderbook[side];
  }

  clear() {
    store.commit("orderbook/clear");
  }
}
