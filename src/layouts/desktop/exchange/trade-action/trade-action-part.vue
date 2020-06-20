<template>
  <div class="trade-action-part">
    <action-balance :currency="currency" />
    <action-input
      class="price"
      v-model="price"
      :prefix="translation('price')"
      :suffix="currency_by_side('buy').toUpperCase()"
      :limit-length-after-dot="price_precision"
      :estimate-value="price_to_usd"
      :error="price_error"
    />
    <action-input
      class="amount"
      v-model="amount"
      :prefix="translation('amount')"
      :suffix="currency_by_side('sell').toUpperCase()"
      :limit-length-after-dot="amount_precision"
      :error="amount_error"
    />
    <a-slider
      v-model="slider_percent"
      :class="class_by_side('trade-action-slider')"
      :marks="marks_slider"
      :step="1"
      :default-value="0"
      :disabled="slider_disabled"
      @change="onSliderPercentChange"
    />
    <div class="total">
      {{ translation("total") }}:
      <span class="value">
        {{ (total || 0).toFixed(total_precision) }}
        {{ currency_by_side("buy").toUpperCase() }}
      </span>
      ≈ ${{ convert_usdt_to_usd(total) }}
    </div>
    <button
      :class="class_by_side('trade-action-button')"
      :disabled="button_disabled"
      @click="place_order"
    >
      {{
        translation(side, {
          currency: currency_by_side("sell").toUpperCase()
        })
      }}
    </button>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";

@Component({
  components: {
    "action-balance": () => import("./trade-action-balance.vue"),
    "action-input": () => import("./trade-action-input.vue")
  }
})
export default class App extends Vue {
  @Prop() public readonly side!: "buy" | "sell";

  public loading = false;
  public price = "";
  public amount = "";
  public slider_percent = 0;
  public marks_slider = {
    0: "",
    25: "",
    50: "",
    75: "",
    100: ""
  };

  get total() {
    const price = Number(this.price);
    const amount = Number(this.amount);

    return price * amount;
  }

  get currency() {
    return this.side === "sell" ? helpers.isAskSymbol() : helpers.isBidSymbol();
  }

  get market() {
    return helpers.isMarket();
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

  get price_error() {
    if (!this.price.length) {
      return false;
    }
    if (Number(this.price) < this.min_price) {
      return "Giá được đặt quá thấp";
    }
  }

  get amount_error() {
    if (!this.amount.length) {
      return false;
    }
    if (Number(this.amount) < this.min_amount) {
      return "Số lượng được đặt quá thấp";
    }
  }

  get price_to_usd() {
    return helpers.getTickerPriceUSD(helpers.isMarket(), Number(this.price));
  }

  get slider_disabled() {
    return !this.balance();
  }

  get button_disabled() {
    const { amount, price } = this;
    const { price_error, amount_error } = this;

    const rule_1 = amount.length && price.length;
    const rule_2 = !price_error && !amount_error;
    const allow = rule_1 && rule_2 && !this.loading;

    return !allow;
  }

  public mounted() {
    ZSmartModel.on("depth-click", this.on_book_click);
  }

  public beforeDestroy() {
    ZSmartModel.remove("depth-click");
  }

  public on_book_click(price: number, amount: number) {
    this.price = price.toString();
    this.amount = amount.toString();
  }

  public balance() {
    const currency = this.currency_by_side(this.side);

    return new helpers.Balance(currency).getAvailable() || 0;
  }

  public class_by_side(class_name: string) {
    return class_name + " " + class_name + "-" + this.side;
  }

  public currency_by_side(side) {
    return side === "sell" ? helpers.isAskSymbol() : helpers.isBidSymbol();
  }

  public convert_usdt_to_usd(number_usdt: number) {
    const price = store.state.public.global_price["USDT"]["USD"];

    return (number_usdt * price).toFixedNumber(2);
  }

  public get_best_price_by_side() {
    return store.state.exchange.depth[
      this.side === "sell" ? "asks" : "bids"
    ].orders[this.side === "sell" ? "minKey" : "maxKey"]();
  }

  public percent_to_amount(percent: number) {
    if (!percent) {
      this.amount = "";
      return;
    }

    const balance = this.balance();
    if (!balance) {
      return 0;
    }
    const price = Number(this.price);
    if (this.side === "sell") {
      this.amount = ((balance * percent) / 100).toString();
    } else {
      const total_balance = balance / price;

      this.amount = ((total_balance * percent) / 100).toString();
    }
  }

  public amount_with_balance(default_price = true) {
    let price = Number(this.price);
    const amount = Number(this.amount);
    const balance = this.balance();
    if (!amount) {
      return;
    }

    if (!price) {
      price = this.get_best_price_by_side();
      if (default_price) {
        this.price = price.toString();
      }
    }

    if (this.side === "sell") {
      if (amount > balance) {
        this.amount = balance.toString();
      }
    } else {
      const total_balance = balance / price;

      if (amount > total_balance) {
        this.amount = total_balance.toString();
      }
    }
  }

  public percent_with_amount() {
    const price = Number(this.price);
    const amount = Number(this.amount);
    const balance = this.balance();

    if (this.side === "sell") {
      this.slider_percent = Number((amount / balance) * 100).toFixedNumber(0);
    } else {
      const total_balance = balance / price;

      this.slider_percent = Number(
        (amount / total_balance) * 100
      ).toFixedNumber(0);
    }
  }

  public onSliderPercentChange(slider_percent: number) {
    this.percent_to_amount(slider_percent);
  }

  public after_order_placed() {
    helpers.runNotice("success", "Order has been placed");
  }

  public async place_order() {
    this.loading = true;

    try {
      await store.dispatch("exchange/PlaceOrder", {
        price: Number(this.price),
        volume: Number(this.amount),
        market: this.market,
        side: this.side
      });
      this.after_order_placed();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      return error;
    }
  }

  public translation(message, data = {}) {
    return helpers.translation("exchange.trade-action." + message, data);
  }

  @Watch("price")
  public onPriceChange() {
    this.amount_with_balance(false);
    if (this.side === "buy") {
      this.percent_with_amount();
    }
  }

  @Watch("amount")
  public onAmountChange() {
    this.amount_with_balance();
    this.percent_with_amount();
  }
}
</script>
