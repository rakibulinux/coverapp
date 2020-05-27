<template>
  <div :class="['order-row', side]">
    <p>
      <span class="info-market text-left">
        <span :class="getTrend(side)">
          {{ capitalizeFirstLetter(side) }} Limit
        </span>
        {{ getMarketName }}
      </span>
      <span class="date text-right">{{ date }}</span>
    </p>
    <p>
      <span class="flex text-left">
        <div class="filled">
          <chart-percent :filled="filled" />
        </div>
        <div class="amount-price">
          <div>
            <div class="label">
              Amount
            </div>
            <div class="info">
              <span class="filled-amount">
                {{ getAmount(executed_volume) }}
              </span>
              <span class="total-amount">/ {{ getAmount(origin_volume) }}</span>
            </div>
          </div>
          <div>
            <div class="label">Price</div>
            <div class="info">
              <span v-text="getPrice(price)"></span>
            </div>
          </div>
        </div>
      </span>
      <span class="action text-right">
        <button v-if="state === 'wait'" @click="cancelOrder(order.id)">
          Cancel
        </button>
      </span>
    </p>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import _chart_percent from "./chart-percent";

export default {
  components: {
    "chart-percent": _chart_percent
  },
  props: {
    order: Object,
    cancelOrder: Function
  },
  computed: {
    market() {
      return this.order.market;
    },
    state() {
      return this.order.state;
    },
    side() {
      return this.order.side;
    },
    price() {
      return Number(this.order.price);
    },
    origin_volume() {
      return Number(this.order.origin_volume);
    },
    executed_volume() {
      return (
        Number(this.order.executed_volume) ||
        this.origin_volume - this.remaining_volume
      );
    },
    remaining_volume() {
      return Number(this.order.remaining_volume);
    },
    getMarketName() {
      const market_id = this.order.market;
      const market = helpers.marketFilter(market_id);
      return market.name.replace("/", " / ");
    },
    date() {
      const date = this.order.created_at;
      return this.getDate(date);
    },
    filled() {
      return parseInt((this.executed_volume / this.origin_volume) * 100);
    },
    pricePrecision() {
      return helpers.pricePrecision(this.market);
    },
    amountPrecision() {
      return helpers.amountPrecision(this.market);
    }
  },
  methods: {
    getTrend: taker_type => helpers.trendType(taker_type),
    capitalizeFirstLetter: string => helpers.capitalizeFirstLetter(string),
    getDate: date => helpers.getDate(date, true),
    getPrice(value) {
      const { pricePrecision } = this;

      return Number(value).toFixed(pricePrecision);
    },
    getAmount(value) {
      const { amountPrecision } = this;

      return Number(value).toFixed(amountPrecision);
    }
  }
};
</script>
