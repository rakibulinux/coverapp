<template>
  <transition name="panel-move">
    <panel-view v-if="isShowing" class="search-market">
      <head-bar v-model="search" @on-remove="remove()" />
      <body-bar
        v-if="search"
        :value="search"
        :find-tickers="findTickers"
        :get-trend="getTrend"
        :percent-to-number="percentToNumber"
        :check-favorite="checkFavorite"
        :add-or-remove-favorite="addOrRemoveFavorite"
      />
    </panel-view>
  </transition>
</template>

<script>
import { head_bar, body_bar } from "./modules";
import Helpers from "@/views/mobile/helpers";
import methods from "../methods";

export default {
  components: {
    "head-bar": head_bar,
    "body-bar": body_bar
  },
  mixins: [methods, Helpers],
  data: () => ({
    search: ""
  }),
  methods: {
    onRender() {
      this.search = "";
    }
  }
};
</script>
