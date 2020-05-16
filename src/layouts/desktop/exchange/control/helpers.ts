import _modal from "@/components/desktop/exchange/_modal.vue";
import _modal_empty from "@/layouts/desktop/exchange/control/_modal_empty.vue";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";

export default {
  props: {
    type_control: String
  },
  components: {
    "modal-exchange": _modal,
    "modal-empty": _modal_empty
  },
  data: () => ({}),
  mounted() {
    ZSmartModel.on("mine_control-updated", () => {
      this.$forceUpdate();
    });
  },
  computed: {
    isAsk: () => helpers.isAskSymbol().toUpperCase(),
    isBid: () => helpers.isBidSymbol().toUpperCase(),
    checkSession() {
      return helpers.isAuth();
    },
    isLoading() {
      return this.$store.getters["exchange/loadingStatus"];
    },
    pricePrecision: () => helpers.pricePrecision(),
    amountPrecision: () => helpers.amountPrecision(),
    totalPrecision: () => helpers.totalPrecision(),
    mine_control() {
      return this.$store.state.exchange.mine_control[this.type_control];
    }
  },
  methods: {
    getDate: time => helpers.getDate(time),
    getPrice(price) {
      return Number(price).toFixed(this.pricePrecision);
    },
    getAmount(amount) {
      return Number(amount).toFixed(this.amountPrecision);
    },
    getTotal(total) {
      return Number(total).toFixed(this.totalPrecision);
    },
    getTrend: taker_type => helpers.trendType(taker_type)
  }
};
