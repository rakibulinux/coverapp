import TradeController from "@/controllers/trade";
import * as helpers from "@zsmartex/z-helpers";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MineControlMixin extends Vue {
  @Prop() public readonly type_control!: string;

  name!: "open_orders" | "orders_history" | "trades_history";

  isAsk = helpers.isAskSymbol().toUpperCase();
  isBid = helpers.isBidSymbol().toUpperCase();
  price_precision = helpers.pricePrecision();
  amount_precision = helpers.amountPrecision();
  total_precision = helpers.totalPrecision();

  get mine_control() {
    return TradeController[this.name];
  }

  get checkSession() {
    return helpers.isAuth();
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
