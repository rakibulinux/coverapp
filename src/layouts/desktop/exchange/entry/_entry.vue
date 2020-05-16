<template>
  <div id="bids_entry">
    <div class="first_tb">
      <span
        class="title"
        v-text="translation('entry.' + side, { currency: currency })"
      />
      <balance :currency="currency" />
    </div>
    <div :class="['price-box', 'input-entry', { active: price.isFocus }]">
      <label class="name" v-text="translation('entry.price')" />
      <input
        v-model="price.value"
        name="price"
        autocomplete="off"
        maxlength="14"
        type="text"
        @blur="price.isFocus = false"
        @input="onPriceInput"
        @focus="onPriceInput"
      />
      <label class="currency" v-text="currency" />
      <div class="estimate-box" :class="{ show: price.value > 0 }">
        ≈ {{ getTickerPriceUSD(market, price.value) }} USD
      </div>
    </div>

    <a-tooltip class="amount-box" placement="top" :visible="AmountError">
      <template slot="title">
        Amount qua' it'
      </template>
      <div
        growing-ignore="true"
        :class="[
          'input-entry',
          { active: amount.isFocus && !AmountError, error: AmountError }
        ]"
      >
        <label class="name" v-text="translation('entry.amount')" />
        <input
          v-model="amount.value"
          name="amount"
          autocomplete="off"
          maxlength="14"
          type="text"
          @blur="amount.isFocus = false"
          @input="onAmountInput"
          @focus="onAmountInput"
        />
        <label class="currency" v-text="isAsk" />
      </div>
    </a-tooltip>

    <div class="chance-box">
      <button @click="setAmount(0.25)">
        25%
      </button>
      <button @click="setAmount(0.5)">
        50%
      </button>
      <button @click="setAmount(0.75)">
        75%
      </button>
      <button @click="setAmount(1)">
        100%
      </button>
    </div>

    <div class="total">
      <em>{{ translation("entry.total") }}:</em>
      {{ total }} {{ isBid }}
    </div>

    <Button
      :class="['submit', trendType(side)]"
      :disabled="disabled_button"
      @click="createOrder"
      v-text="translation('entry.' + side, { currency: currency })"
    />
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import _balance from "./_balance.vue";

export default {
  components: {
    balance: _balance
  },
  props: {
    side: String
  },
  data: () => ({
    price: {
      value: "",
      isFocus: false
    },
    amount: {
      value: "",
      isFocus: false
    },
    theme: localStorage.getItem("exchangeTheme") === "night" ? "light" : "dark",
    AmountError: false,
    disabled_button: false
  }),
  computed: {
    isAuth: () => helpers.isAuth(),
    market: () => helpers.isMarket(),
    isAsk: () => helpers.isAskSymbol().toUpperCase(),
    isBid: () => helpers.isBidSymbol().toUpperCase(),
    currency() {
      if (this.side === "buy") {
        return this.isBid;
      } else {
        return this.isAsk;
      }
    },
    total() {
      return Number(this.price.value * this.amount.value).toFixed(8);
    }
  },
  watch: {
    "price.value"() {
      this.price.value = helpers.inputOnlyNumber(
        this.price.value,
        helpers.pricePrecision()
      );
    },
    "amount.value"() {
      this.amount.value = helpers.inputOnlyNumber(
        this.amount.value,
        helpers.amountPrecision()
      );
    }
  },
  mounted() {
    ZSmartModel.on("onBookClick", order => {
      this.amount.value = order.amount;
      this.price.value = order.price;
    });
  },
  methods: {
    balance() {
      return new helpers.Balance(this.currency).getAvailable();
    },
    getBestPrice: (market, side) => helpers.getBestPrice(market, side),
    trendType: type => helpers.trendType(type, true),
    getTickerPriceUSD: (ticker, price) =>
      helpers.getTickerPriceUSD(ticker, price),
    setAmount(chance) {
      const { side, balance } = this;
      if (side === "buy") {
        if (!Number(this.price.value)) {
          this.price.value = this.getBestPrice(this.market, "sell");
        }

        this.amount.value = (balance() / this.price.value) * chance;
      } else {
        if (!Number(this.price.value)) {
          this.price.value = this.getBestPrice(this.market, "buy");
        }

        this.amount.value = balance() * chance;
      }
    },
    onPriceInput(focus = true) {
      this.onFocusPrice = focus;
    },
    onAmountInput(focus = true) {
      this.onFocusAmount = focus;
    },
    buttonState(state) {
      this.disabled_button = state;
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
        ZSmartModel.emit("order-place");
      } catch (error) {
        return error;
      }
      this.buttonState(false);
    },
    translation: (message, data = {}) =>
      helpers.translation("exchange." + message, data)
  }
};
</script>
