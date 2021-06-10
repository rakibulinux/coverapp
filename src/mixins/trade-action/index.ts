import { PublicController, UserController, TradeController } from '@/controllers';
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export class TradeActionMixin extends Vue {
  side!: ZTypes.OrderSide;
  ord_type!: ZTypes.OrdType;
  loading = false;
  price = "";
  amount = "";
  slider_percent = 0;
  marks_slider = {
    0: "",
    25: "",
    50: "",
    75: "",
    100: ""
  };

  get authorized() {
    return UserController.state == "active";
  }

  get currency() {
    return this.side === "sell" ? this.market.base_unit : this.market.quote_unit;
  }

  get market() {
    return TradeController.market;
  }

  get min_amount() {
    return helpers.minAmount();
  }

  get min_price() {
    return helpers.minPrice();
  }

  get price_precision() {
    return helpers.pricePrecision();
  }

  get amount_precision() {
    return helpers.amountPrecision();
  }

  get total_precision() {
    return helpers.totalPrecision();
  }

  get total() {
    const price = Number(this.price);
    const amount = Number(this.amount);

    return (price * amount).toFixedNumber(this.total_precision);
  }

  get fee() {
    const ANY = "any";
    const total = this.total;
    const { total_precision } = this;
    const trading_fees = PublicController.trading_fees;
    const user_role = UserController.role;

    const trading_fee =
      trading_fees.find(trading_fee => {
        const rule1 = trading_fee.group === user_role;
        const rule2 =
          trading_fee.market_id === this.market.id ||
          trading_fee.market_id === ANY;

        return rule1 && rule2;
      }) ||
      trading_fees.find(trading_fee => {
        return (
          (trading_fee.group === ANY &&
            trading_fee.market_id === this.market.id) ||
          trading_fee.market_id === ANY
        );
      });

    return (
      Number(trading_fee[this.side === "buy" ? "maker" : "taker"]) * total
    ).toFixed(total_precision);
  }

  get price_error() {
    if (!this.price.length) {
      return false;
    }
    if (Number(this.price) < this.min_price) {
      return "Price too low";
    }
  }

  get amount_error() {
    if (!this.amount.length) {
      return false;
    }
    if (Number(this.amount) < this.min_amount) {
      return "Amount too low";
    }
  }

  get button_disabled() {
    const { amount, price } = this;
    const { price_error, amount_error } = this;

    const rule_1 = amount.length && price.length;
    const rule_2 = !price_error && !amount_error;
    const allow = rule_1 && rule_2 && !this.loading;

    return !allow;
  }

  get assets() {
    const currency = this.currency_by_side(this.side);

    return new helpers.Balance(currency);
  }

  mounted() {
    ZSmartModel.on("depth-click", this.on_book_click);
  }

  beforeDestroy() {
    ZSmartModel.remove("depth-click", this.on_book_click);
  }

  on_book_click(price: number, amount: number) {
    this.price = price.toString();
    this.amount = amount.toString();
  }

  currency_by_side(side) {
    return TradeController.market[side === "sell" ? "base_unit" : "quote_unit"].toUpperCase();
  }

  translation(message, data = {}) {
    return helpers.translation("page.exchange.trade_action." + message, data);
  }

  amount_with_balance(default_price = true) {
    let price = Number(this.price);
    const amount = Number(this.amount);
    const available = this.assets.available;
    if (!amount) {
      return;
    }

    if (!price) {
      const best_price = TradeController.get_best_price(this.side);

      if (!best_price) return;
      price = best_price;
      if (default_price) {
        this.price = price.toString();
      }
    }

    if (this.side === "sell") {
      if (amount > available) {
        this.amount = available.toString();
      }
    } else {
      const total_balance = available / price;

      if (amount > total_balance) {
        this.amount = total_balance.toString();
      }
    }
  }

  percent_to_amount(percent: number) {
    const available = this.assets.available;
    const price = Number(this.price);

    if (!percent) {
      return this.amount = "";
    }
    if (!available) return 0;
    if (this.side === "sell") {
      this.amount = ((available * percent) / 100).toString();
    } else {
      const total_balance = available / price;

      this.amount = ((total_balance * percent) / 100).toString();
    }
  }

  percent_with_amount() {
    const price = Number(this.price);
    const amount = Number(this.amount);
    const available = this.assets.available;

    if (this.side === "sell") {
      this.slider_percent = ((amount / available) * 100).toFixedNumber(0);
    } else {
      const total_balance = available / price;

      this.slider_percent = (
        (amount / total_balance) * 100
      ).toFixedNumber(0);
    }
  }

  amount_to_usd(currency_id: string, amount: number) {
    const price_by_usd = currency_id.toLowerCase() == 'usdt' ? 1 : new helpers.Currency(currency_id).getPriceByUSD();

    return price_by_usd * amount;
  }

  async create_order() {
    if (!this.authorized) {
      if (helpers.isMobile()) {
        ZSmartModel.emit("need-login");
      }

      return;
    }
    this.loading = true;
    await TradeController.create_order(this.market.id, this.side, this.ord_type, Number(this.price), Number(this.amount));
    this.loading = false;
  }

  onSliderPercentChange(slider_percent: number) {
    this.percent_to_amount(slider_percent);
  }

  change_ord_type(ord_type: ZTypes.OrdType) {
    this.ord_type = ord_type;
  }

  @Watch("price")
  onPriceChange() {
    this.amount_with_balance(false);
    if (this.side === "buy") {
      this.percent_with_amount();
    }
  }

  @Watch("amount")
  onAmountChange() {
    this.amount_with_balance();
    this.percent_with_amount();
  }
}
