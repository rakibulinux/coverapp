<template>
  <div class="order-entry">
    <div class="choice-side">
      <span
        v-for="data in SIDE"
        :key="data"
        :class="[
          'text-center',
          { selected: side === data },
          data === 'buy' ? 'bg-up' : 'bg-down'
        ]"
        @click="changeSide(data)"
      >
        {{ getType(data) }}
      </span>
    </div>
    <input-entry
      ref="price"
      v-model="price.value"
      type="price"
      :change-focus="changeFocus"
      :is-focus="price.isFocus"
      :number-calc="numberCalc"
    />
    <div class="valuation">
      Valuation $ 1.99
    </div>
    <input-entry
      ref="amount"
      v-model="amount.value"
      type="amount"
      :change-focus="changeFocus"
      :is-focus="amount.isFocus"
      :number-calc="numberCalc"
    />

    <div class="chance-picker">
      <span v-for="chance in CHANCE" :key="chance" class="text-center">
        {{ chance }}%
      </span>
    </div>

    <input-entry
      ref="total"
      v-model="total.value"
      type="total"
      :turn-down-up="false"
      :change-focus="changeFocus"
      :is-focus="total.isFocus"
      :number-calc="numberCalc"
    />
    <button
      :class="['text-center', side === 'buy' ? 'bg-up' : 'bg-down']"
      @click="createOrder"
    >
      {{ getType(side) }}
    </button>
    <div class="balance-static">
      <p>
        <span class="text-left name">Availiable</span>
        <span class="text-right">{{ getAvailable }}</span>
      </p>
      <p>
        <span class="text-left name">Locked</span>
        <span class="text-right">{{ getLocked }}</span>
      </p>
      <p>
        <span class="text-left name">Total</span>
        <span class="text-right">{{ getTotal }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import input_entry from "./order-entry/input_entry";

export default {
  components: {
    "input-entry": input_entry
  },
  data: () => ({
    CHANCE: [25, 50, 75, 100],
    SIDE: ["buy", "sell"],
    price: {
      value: helpers.getMarketLastPrice(),
      isFocus: true
    },
    amount: {
      value: "",
      isFocus: false
    },
    total: {
      value: "",
      isFocus: false
    },
    side: "buy",
    loading: false
  }),
  computed: {
    isAuth: () => helpers.isAuth(),
    market: () => helpers.isMarket(),
    isAsk: () => helpers.isAskSymbol().toUpperCase(),
    isBid: () => helpers.isBidSymbol().toUpperCase(),
    pricePrecision: () => helpers.pricePrecision(),
    amountPrecision: () => helpers.amountPrecision(),
    totalPrecision: () => helpers.totalPrecision(),
    getAssets() {
      const { side, isAsk, isBid } = this;
      const currency =
        side === "sell" ? isAsk.toLowerCase() : isBid.toLowerCase();

      return new helpers.Balance(currency);
    },
    getAvailable() {
      return this.isAuth ? this.getAssets.getAvailable() : "--";
    },
    getLocked() {
      return this.isAuth ? this.getAssets.getLocked() : "--";
    },
    getTotal() {
      return this.isAuth ? this.getAssets.getTotal() : "--";
    }
  },
  watch: {
    "price.value"() {
      if (!this.price.isFocus) return;
      this.price.value = helpers.inputOnlyNumber(
        this.price.value,
        this.pricePrecision
      );
      this.calcTotal();
    },
    "amount.value"() {
      if (!this.amount.isFocus) return;
      this.amount.value = helpers.inputOnlyNumber(
        this.amount.value,
        this.amountPrecision
      );
      this.calcTotal();
    },
    "total.value"() {
      if (!this.total.isFocus) return;
      this.total.value = helpers.inputOnlyNumber(
        this.total.value,
        this.totalPrecision
      );
      this.calcAmount();
    }
  },
  methods: {
    getType: type => helpers.getType(type),
    changeSide(side) {
      this.side = side;
    },
    buttonState(state) {
      this.loading = state;
    },
    async createOrder() {
      this.buttonState(true);
      const payload = {
        market: this.market,
        side: this.side,
        volume: this.amount.value,
        price: this.price.value
      };
      try {
        await this.$store.dispatch("exchange/PlaceOrder", payload);
        this.clearInput();
        this.buttonState(false);
      } catch (error) {
        this.buttonState(false);
        return error;
      }
    },
    clearInput() {
      const INPUT = ["price", "amount", "total"];

      for (const input of INPUT) {
        this[input].value = "";

        this.$refs[input].clear();
      }
    },
    numberCalc(type, calc) {
      this.$refs[type].focus();
      const precision = this[`${type}Precision`];

      const AddRemoveInt = Number(
        ["0", Array(precision).join(0) + "1"].join(".")
      );

      if (calc === "down") {
        if (!Number(this[type].value)) return;
        this[type].value = (Number(this[type].value) - AddRemoveInt).toFixed(
          precision
        );
      } else {
        this[type].value = (Number(this[type].value) + AddRemoveInt).toFixed(
          precision
        );
      }
      this[type].value;
    },
    calcAmount() {
      if (Number(this.price.value) === 0 || Number(this.total.value) === 0) {
        this.amount.value = "0";
      } else if (!this.total.value.length) {
        this.amount.value = "";
      } else if (this.price.value) {
        this.amount.value = Number(this.total.value / this.price.value).toFixed(
          this.amountPrecision
        );
      } else {
        this.price.value = "0";
      }
    },
    calcTotal() {
      if (!this.price.value.length || !this.amount.value.length) {
        this.total.value = "";
      } else if (
        Number(this.price.value) === 0 ||
        Number(this.amount.value) === 0
      ) {
        this.total.value = "0";
      } else if (this.price.value && this.amount.value)
        this.total.value = Number(this.price.value * this.amount.value).toFixed(
          this.totalPrecision
        );
    },
    changeFocus(type, value) {
      this[type].isFocus = value;
    }
  }
};
</script>
