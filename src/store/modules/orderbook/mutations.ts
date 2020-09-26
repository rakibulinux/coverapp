import { MutationTree } from "vuex";
import { OrderBookState } from "./types";

const mutations: MutationTree<OrderBookState> = {
  add(state, { price, amount, side }: { price: number, amount: number, side: ZTypes.TakerType }) {
    const index = state[side].findIndex(row => row.price === price);
    if (index >= 0) {
      state[side][index].amount = amount;
    } else {
      state[side].push({ price, amount });

      state[side] = state[side].sort((a, b) => a.price - b.price);
    }
  },
  remove(state, { price, side }: { price: number, side: ZTypes.TakerType}) {
    const index = state[side].findIndex(row => row.price === price);

    if (index >= 0) state[side].splice(index, 1);
  },
  clear(state) {
    state.asks = [];
    state.bids = [];
  }
}

export default mutations;
