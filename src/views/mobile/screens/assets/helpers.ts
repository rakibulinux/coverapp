import Helpers from "@/views/mobile/helpers";
import * as helpers from "@zsmartex/z-helpers";
import methods from "../methods";

export default {
  mixins: [methods, Helpers],
  props: {
    currency: String
  },
  computed: {
    Currency() {
      return new helpers.Currency(this.currency);
    },
    Balance() {
      return new helpers.Balance(this.currency);
    },
    totalUSD() {
      return this.Balance.getTotalUSD() || 0;
    },
    totalBTC() {
      return this.Balance.getTotalBTC() || 0;
    }
  },
  methods: {
    openPanel(modal) {
      this.$refs[modal].render();
    }
  }
};
