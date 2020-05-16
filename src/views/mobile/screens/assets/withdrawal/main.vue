<template>
  <transition name="panel-move">
    <panel-view v-if="isShowing" class="screen-assets-m withdrawal">
      <head-bar title="Withdrawal" @on-remove="remove()" />
      <div class="body-bar">
        <div class="withdraw-box">
          <input-completer
            v-model="amount"
            label="Withdrawal Amount"
            placeholder="Enter your amount"
            type="number"
          >
            <template v-slot:right>
              <span class="note">{{ currency.toUpperCase() }}</span>
              <span @click="onClickAllAmount">
                All
              </span>
            </template>
          </input-completer>

          <input-completer
            v-model="address"
            label="Withdrawal Address"
            placeholder="Enter your address"
          >
            <!-- TODO: add support completer to choose an address from the list of addresses -->
          </input-completer>
        </div>
        <div class="action">
          <button @click="openTotp">
            Withdrawal
          </button>
        </div>
      </div>
      <totp-panel ref="totp-panel" @on-submit="toptSubmit" />
    </panel-view>
  </transition>
</template>

<script>
import totp_panel from "@/views/mobile/screens/totp";
import Helpers from "../helpers";

export default {
  components: {
    "totp-panel": totp_panel
  },
  mixins: [Helpers],
  props: {
    currency: String
  },
  data: () => ({
    loading: false,
    amount: "",
    address: "",
    otp_code: ""
  }),
  computed: {
    balance() {
      return new helpers.Balance(this.currency).getAvailable();
    },
    rid() {
      return this.address;
    },
    otp() {
      return this.otp_code;
    }
  },
  methods: {
    onClickAllAmount() {
      this.amount = Number(this.balance);
    },
    openTotp() {
      this.$refs["totp-panel"].render();
    },
    closeTotp() {
      this.$refs["totp-panel"].remove();
    },
    toptSubmit(otp_code) {
      this.otp_code = otp_code;
      this.sendWithdrawal();
    },
    async sendWithdrawal() {
      const { rid, currency, amount, otp } = this;
      const payload = { rid, currency, amount, otp };

      this.loading = true;
      try {
        await new ApiClient("trade").post("account/withdraws", payload);
        this.loading = false;
        this.closeTotp();
      } catch (error) {
        this.loading = false;
        return error;
      }
    }
  }
};
</script>
