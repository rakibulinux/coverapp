import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";

export default {
  data: () => ({
    SIDE: ["asks", "bids"],
    market: null,
    MAX_SIZE: 6,
    isBid: "",
    isAsk: "",
    whShow: "normal",
    maxTotal: {
      asks: 0,
      bids: 0
    }
  }),
  computed: {
    getDepth() {
      var depth = this.$store.state.exchange.depth;
      for (const side of this.SIDE) {
        if (depth[side].length > 6) {
          depth[side] =
            side === "asks"
              ? depth[side]
                  .reverse()
                  .splice(0, 6)
                  .reverse()
              : depth[side].splice(0, 6);
          this.calcMaxTotal(depth[side], side);
        } else {
          this.calcMaxTotal(depth[side], side);
        }
      }

      return depth;
    }
  },
  methods: {
    fakeDepth(side) {
      const length = this.getDepth[side].length;
      const countFake = this.MAX_SIZE - length;

      if (countFake <= 0) return [];
      return countFake;
    },
    calcMaxTotal(depth, side) {
      this.maxTotal[side] = 0;
      for (const row of depth) {
        this.maxTotal[side] += Number(row[0] * row[1]);
      }
    },
    findIndexOrder(depth, price) {
      return depth.findIndex(row => row[0] == price);
    },
    onRowClicked(side, order) {
      const depth = this.getDepth(side);
      const indexOrder = this.findIndexOrder(depth, order[0]);
      let amount = 0;
      if (side === "bids") {
        let index = 0;
        while (index <= indexOrder) {
          amount += Number(depth[index][1]);
          index++;
        }
      } else {
        if (depth.length - indexOrder > 1) {
          let index = depth.length - 1;
          while (index >= indexOrder) {
            amount += Number(depth[index][1]);
            index--;
          }
        } else amount = Number(depth[indexOrder][1]);
      }
      const payload = {
        price: order[0],
        amount: amount
      };
      ZSmartModel.emit("book-click", payload);
    },
    getPrice: price => (price * 1).toFixed(helpers.pricePrecision()),
    getAmount: amount => (amount * 1).toFixed(helpers.amountPrecision()),
    getVolume: (price, amount) =>
      (price * amount).toFixed(helpers.totalPrecision())
  },
  watch: {}
};
