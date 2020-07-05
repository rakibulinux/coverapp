<template>
  <div :class="['trade-action', side]">
    <div class="trade-action-side">
      <span
        v-for="(_side, index) in SIDE"
        :key="index"
        @click="side = _side"
        :class="{
          [`bg-${_side === 'buy' ? 'up' : 'down'}`]: side === _side,
          [`text-${_side === 'buy' ? 'up' : 'down'}`]: side !== _side
        }"
      >
        {{ _side === "buy" ? "Buy" : "Sell" }}
      </span>
    </div>
    <div class="trade-action-type-picker" @click="show_type_picker">
      <span class="trade-action-type-picker-value">
        {{ ord_type === "limit" ? "Limit Order" : "Market Order" }}
        <a-icon class="trade-action-type-picker-icon" type="caret-down" />
      </span>
    </div>
    <trade-action-input
      v-model="price"
      :placeholder="`Price(${isBid})`"
      :precision="price_precision"
    />
    <div class="trade-action-estimate">≈ {{ price_with_fiat_unit }} USD</div>
    <trade-action-input
      v-model="amount"
      :placeholder="`Amount(${isAsk})`"
      :precision="amount_precision"
    />
    <div class="trade-action-amount-picker">
      <span v-for="percent in AMOUNT_PERCENT" :key="percent">
        {{ percent }}%
      </span>
    </div>
    <div class="trade-action-calculate-total">
      Total:
      <span class="trade-action-calculate-total-value">{{ total }}</span>
      ≈ {{ total_with_fiat_unit }} USD
    </div>

    <div class="trade-action-calculate-fee">
      Fee: <span class="trade-action-calculate-fee-value">{{ fee }}</span>
    </div>
    <div class="trade-action-button">
      {{
        authorized
          ? [side === "buy" ? "Buy" : "Sell", isAsk].join(" ")
          : "Login"
      }}
    </div>
    <trade-action-balance :currency_id="side === 'buy' ? isBid : isAsk" />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import * as helpers from "@zsmartex/z-helpers";
import { Picker } from "cube-ui";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "trade-action-input": () => import("./trade-action-input.vue"),
    "trade-action-balance": () => import("./trade-action-balance.vue")
  }
})
export default class TradeAction extends Vue {
  picker!: Picker;

  side = "buy";
  ord_type = "limit";
  price = "";
  amount = "";

  SIDE = ["buy", "sell"];
  AMOUNT_PERCENT = [25, 50, 75, 100];
  ORDER_TYPES = [
    { value: "limit", text: "Limit Order" },
    { value: "market", text: "Market Order" }
  ];

  get total() {
    const price = Number(this.price);
    const amount = Number(this.amount);
    const { total_precision } = this;

    return (price * amount).toFixed(total_precision);
  }

  get fee() {
    const ANY = "any";
    const total = Number(this.total);
    const { total_precision } = this;
    const { trading_fees } = store.state.public;
    const user_role = store.state.user.role;

    const trading_fee =
      trading_fees.find(trading_fee => {
        const rule1 = trading_fee.group === user_role;
        const rule2 =
          trading_fee.market_id === this.market_id ||
          trading_fee.market_id === ANY;

        return rule1 && rule2;
      }) ||
      trading_fees.find(trading_fee => {
        return (
          (trading_fee.group === ANY &&
            trading_fee.market_id === this.market_id) ||
          trading_fee.market_id === ANY
        );
      });

    return (
      Number(trading_fee[this.side === "buy" ? "maker" : "taker"]) * total
    ).toFixed(total_precision);
  }

  get market_id() {
    return helpers.isMarket();
  }

  get isAsk() {
    return helpers.isAskSymbol().toUpperCase();
  }

  get isBid() {
    return helpers.isBidSymbol().toUpperCase();
  }

  get authorized() {
    return helpers.isAuth();
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

  get price_with_fiat_unit() {
    return helpers
      .getTickerPriceUSD(this.market_id, Number(this.price))
      .toFixed(2);
  }

  get total_with_fiat_unit() {
    return helpers
      .getTickerPriceUSD(this.market_id, Number(this.total))
      .toFixed(2);
  }

  change_side(side) {
    this.side = side;
  }

  change_ord_type(ord_type: string) {
    this.ord_type = ord_type;
  }

  show_type_picker() {
    if (!this.picker) {
      this.picker = this.$createPicker({
        title: "Order Type",
        data: [this.ORDER_TYPES],
        onSelect: this.change_ord_type,
        cancelTxt: "Cancel",
        confirmTxt: "Confirm"
      });
    }
    this.picker.show();
  }
}
</script>

<style lang="less">
@trade-action-input-height: 25px;

.trade-action {
  padding-right: 4px;

  &-side {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      flex: 1;
      height: 25px;
      line-height: 25px;
      margin: 0 4px;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      border-radius: 2px;
      color: var(--bg-color);
      background-color: var(--bg-card-color);

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &-type-picker {
    position: relative;
    font-size: 12px;
    font-weight: 500;
    margin: 6px 0;
    color: var(--color-gray);

    &-value {
      position: relative;
    }

    &-icon {
      position: absolute;
      right: -10px;
      bottom: 0px;
      font-weight: 500;
      transform: rotate(-45deg);
      font-size: 7px;
    }
  }

  &-input {
    position: relative;
    height: @trade-action-input-height;
    line-height: @trade-action-input-height;

    &-action {
      position: absolute;
      height: 100%;
      top: 0;
      width: @trade-action-input-height;
      text-align: center;
      background-color: var(--bg-card-head-color);
      color: var(--color-gray);
      font-size: 14px;

      &.minus {
        left: 0;
        border-radius: 2px 0px 0px 2px;
      }

      &.plus {
        right: 0;
        border-radius: 0px 2px 2px 0px;
      }
    }

    input {
      width: 100%;
      height: @trade-action-input-height;
      line-height: @trade-action-input-height;
      text-align: center;
      background-color: var(--bg-card-color);
      border-radius: 2px;
    }
  }

  &-estimate {
    color: var(--color-gray);
    font-size: 8px;
    margin: 2px 0;
  }

  &-balance {
    &-row {
      position: relative;
      font-size: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;

      &-title {
        color: var(--color-gray);
      }

      &:nth-child(2) {
        margin-bottom: 6px;

        &:after {
          content: "";
          height: 1px;
          width: 100%;
          position: absolute;
          bottom: -4px;
          left: 0;
          background-color: var(--border-color);
        }
      }
    }
  }

  &-amount-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;

    span {
      flex: 1;
      text-align: center;
      font-size: 8px;
      margin: 0 4px;
      border: 1px solid var(--border-color);
      border-radius: 2px;
      padding: 1px 0;

      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }

  &-calculate-total {
    color: var(--color-gray);
    margin-top: 4px;

    &-value {
      color: var(--text-default-color);
    }
  }

  &-calculate-fee {
    color: var(--color-gray);
    margin-top: 4px;

    &-value {
      color: var(--text-default-color);
    }
  }

  &-button {
    margin: 10px 0;
    height: 25px;
    line-height: 25px;
    border-radius: 2px;
    width: 100%;
    text-align: center;
    font-weight: 500;
  }

  &.buy &-button {
    background-color: var(--up-color);
  }

  &.sell &-button {
    background-color: var(--down-color);
  }
}
</style>
