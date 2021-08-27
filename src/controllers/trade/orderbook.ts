import TradeController from "@/controllers/trade";

export default class OrderBook {
  market_id?: string;

  constructor(market_id?: string) {
    this.market_id = market_id;
  }

  get book() {
    return TradeController.store.depth;
  }

  get sequence() {
    return this.book.sequence;
  }

  set sequence(sequence: number) {
    this.book.sequence = sequence
  }

  get loading() {
    return this.book.loading;
  }

  set loading(loading: boolean) {
    this.book.loading = loading;
  }

  async fetch(market_id: string, limit?: number) {
    this.loading = true;
    this.market_id = market_id;

    try {
      this.clear();
      const { data } = await TradeController.get_depth(market_id, limit);
      const depth: { [key in ZTypes.TakerType]: string[][] } = data;
      this.loading = false;

      ["asks", "bids"].forEach((side: ZTypes.TakerType) => {
        depth[side].forEach(row => {
          const price = row[0];
          const amount = row[1];

          this.add(price, amount, side);
        })
      })
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  add(price: string, amount: string, side: ZTypes.TakerType) {
    if (this.loading) return;
    const index = this.book[side].findIndex(row => row.price === price);
    if (index >= 0) {
      this.book[side][index].amount = amount;
    } else {
      this.book[side].push({ price, amount });

      this.book[side] = this.book[side].sort((a, b) => {
        if (side == "asks") return Number(a.price) - Number(b.price);
        if (side == "bids") return Number(b.price) - Number(a.price);
      });
    }
  }

  remove(price: string, side: ZTypes.TakerType) {
    if (this.loading) return;

    const index = this.book[side].findIndex(row => row.price === price);

    if (index >= 0) this.book[side].splice(index, 1);
  }

  toArray(side: ZTypes.TakerType, limit = 100) {
    return this.book[side].slice(0, limit);
  }

  clear() {
    this.book.asks = [];
    this.book.bids = [];
    this.book.sequence = 0;
  }
}
