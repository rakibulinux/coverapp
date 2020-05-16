<template>
  <div class="orderbook">
    <div class="ex_table table_noscroll">
      <dt>
        <span class="text-left">Price({{ isAsk.toUpperCase() }})</span>
        <span class="text-right">Amount</span>
      </dt>
      <fake-depth side="asks" />
      <depth v-if="gettedDepth" side="asks" class="asks" />
      <ticker-status />
      <depth v-if="gettedDepth" side="bids" class="bids" />
      <fake-depth side="bids" />
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import _depth from "./orderbook/_depth";
import _fake_depth from "./orderbook/_fake_depth";
import _ticker_status from "./orderbook/_ticker_status";

export default {
  computed: {
    isAsk: () => helpers.isAskSymbol(),
    gettedDepth() {
      return this.$store.getters["exchange/checkGettedDepth"];
    }
  },
  methods: {},
  components: {
    depth: _depth,
    "fake-depth": _fake_depth,
    "ticker-status": _ticker_status
  }
};
</script>