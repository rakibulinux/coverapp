<template>
  <transition name="panel-move">
    <panel-view v-if="isShowing" class="screen-assets-m currency">
      <head-bar title="Assets" @on-remove="remove()" />
      <div class="body-bar">
        <div class="information-currency">
          <div class="name"></div>
          <div class="value">
            <div>
              <p class="total">
                <span class="text-left name">Total</span>
                <span class="text-right value">{{ Balance.getTotal() }}</span>
              </p>
              <p class="available">
                <span class="text-left name">Available</span>
                <span class="text-right value">
                  {{ Balance.getAvailable() }}
                </span>
              </p>
              <p class="in-order">
                <span class="text-left name">In Order</span>
                <span class="text-right value">{{ Balance.getLocked() }}</span>
              </p>
            </div>
            <div class="valuation">
              <p class="estimate">
                <span class="text-left name">Estimated Value(BTC)</span>
                <span class="text-right value">{{ totalBTC }}</span>
              </p>
              <p class="estimate">
                <span class="text-left name">Estimated Value($)</span>
                <span class="text-right value">${{ totalUSD }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="information-trade">
          <div class="title">
            Go to trade
          </div>
          <div class="content">
            <div v-for="market in MARKET" :key="market.id" class="market">
              <p>
                <span class="name" v-text="market.name.replace('/', ' / ')" />
                <span
                  :class="[
                    'change',
                    'text-right',
                    getTrend(market.price_change_percent)
                  ]"
                  v-text="market.price_change_percent"
                />
              </p>
              <p class="price">
                <span v-text="market.last" />
              </p>
            </div>
          </div>
        </div>
        <div class="action">
          <button class="bg-up" @click="openDepositPanel">
            Deposit
          </button>
          <button class="bg-down" @click="openWithdrawalPanel">
            Withdrawal
          </button>
        </div>
      </div>
    </panel-view>
  </transition>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";
import Helpers from "../helpers";

export default {
  mixins: [Helpers],
  props: {
    openPanels: Function
  },
  computed: {
    otp_enabled() {
      return this.$store.state.user.otp;
    },
    MARKET() {
      const { currency } = this;
      const TICKER = this.$store.getters["public/getAllTickers"];
      return Object.values(TICKER).filter(ticker => {
        if (ticker.base_unit === currency) return ticker;
      });
    }
  },
  methods: {
    getTrend(change) {
      change = change.replace("%", "");
      return change >= 0 ? "text-up" : "text-down";
    },
    openDepositPanel() {
      this.openPanels("deposit-panel");
    },
    openWithdrawalPanel() {
      if (this.otp_enabled) {
        this.openPanels("withdrawal-panel");
      } else {
        ZSmartModel.emit("need-setup-2fa");
      }
    }
  }
};
</script>
