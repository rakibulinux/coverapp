import * as helpers from "@zsmartex/z-helpers";

export default {
  data: () => ({
    TYPE: ["All", "Buy", "Sell"],
    STATUS: ["All", "Waiting", "Filled", "Canceled"],
    market: "All",
    input_market: "All",
    input_changed: false,
    status: "All",
    type: "All",
    loading: false,
    array: {
      data: [],
      page: 1,
      max: 0
    }
  }),
  computed: {
    MARKET: () => helpers.MARKET()
  },
  methods: {
    pricePrecision: market => helpers.pricePrecision(market),
    amountPrecision: market => helpers.amountPrecision(market),
    totalPrecision: market => helpers.totalPrecision(market),
    trendType: type => helpers.trendType(type),
    getDate: date => helpers.getDate(date, true),
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    market_InputFocus($event) {
      $event.target.select();
      this.input_changed = false;
    },
    market_InputBlur($event) {
      $event.target.blur();
      this.input_market = this.market;
      this.input_changed = false;
    },
    filterMethod(value, option) {
      if (!this.input_changed) return true;
      return option.toUpperCase().includes(value.toUpperCase());
    },
    getPrice(value, market) {
      return Number(value).toFixed(this.pricePrecision(market));
    },
    getAmount(value, market) {
      return Number(value).toFixed(this.amountPrecision(market));
    },
    getTotal(value, market) {
      return Number(value).toFixed(this.totalPrecision(market));
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    market() {
      if (this.time) return;
      this.getData();
    },
    status() {
      if (this.time) return;
      this.getData();
    },
    type() {
      if (this.time) return;
      this.getData();
    }
  }
};
