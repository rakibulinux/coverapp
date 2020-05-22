import store from "@/store";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MineControlMixin extends Vue {
  @Prop() public readonly type_control!: string;

  public isAsk = helpers.isAskSymbol().toUpperCase();
  public isBid = helpers.isBidSymbol().toUpperCase();
  public price_precision = helpers.pricePrecision();
  public amount_precision = helpers.amountPrecision();
  public total_precision = helpers.totalPrecision();

  get checkSession() {
    return helpers.isAuth();
  }
  get isLoading() {
    return store.getters["exchange/loadingStatus"];
  }
  get mine_control_data() {
    return store.state.exchange.mine_control;
  }

  public mounted() {
    ZSmartModel.on("mine_control-updated", () => {
      this.$forceUpdate();
    });
  }

  public getDate(time) {
    return helpers.getDate(time);
  }

  public getPrice(price) {
    return Number(price).toFixed(this.price_precision);
  }

  public getAmount(amount) {
    return Number(amount).toFixed(this.amount_precision);
  }

  public getTotal(total) {
    return Number(total).toFixed(this.total_precision);
  }

  public getTrend(taker_type) {
    return helpers.trendType(taker_type);
  }
}
