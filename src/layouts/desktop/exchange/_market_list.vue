<template>
  <div id="market_list">
    <div class="input-box">
      <input v-model="search" placeholder="Search" maxlength="9" type="text" />
      <a-icon type="search" />
    </div>
    <div class="markets">
      <span
        class="favorites"
        :class="{ selected: isSelected === 'Favorites' }"
        @click="changeSelect('Favorites')"
      >
        <i class="ic-star" />
      </span>
      <span
        v-for="(data, index) in MARKETS"
        :key="index"
        :class="{ selected: isSelected === data }"
        @click="changeSelect(data)"
        v-text="data"
      />
    </div>
    <div class="ex_table table_sorter">
      <dt>
        <span
          v-for="data in SORT"
          :key="data.name"
          :class="[data.class, data.name]"
          @click="changeSort(data.name)"
        >
          <span class="market" v-text="$t('table.' + data.name)" />
          <span v-if="data.enabled" class="market sorter">
            <i
              class="ic-arrow-caret-up"
              :class="{ active: sortBy === data.sortBy && !sortReverse }"
            />
            <i
              class="ic-arrow-caret-down"
              :class="{ active: sortBy === data.sortBy && sortReverse }"
            />
          </span>
        </span>
      </dt>
      <div class="list-item">
        <p
          v-for="(data, index) in findTickers"
          :key="index"
          :class="{ selected: isActive(data.base_unit + data.quote_unit) }"
          @click="MarketReload(data.name)"
        >
          <span class="text-left currency">
            <span class="favorite">
              <i
                v-if="!checkFavorite(data.name)"
                class="ic-no-star"
                @click.stop="addOrRemoveFavorite(data.name, $event)"
              />
              <i
                v-else
                class="ic-star"
                @click.stop="addOrRemoveFavorite(data.name, $event)"
              />
            </span>
            <span v-text="data.base_unit.toUpperCase()"></span>
          </span>

          <span class="text-right price">
            <span v-text="getPrice(data.last)" />
          </span>

          <span class="text-right change">
            <span
              :class="getTrend(data.price_change_percent)"
              v-text="data.price_change_percent"
            />
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import config from "@/config";

export default {
  data: () => ({
    isAsk: null,
    isBid: null,
    isSelected: "",
    isSelectedDrop: "",
    showing: false,
    search: "",
    totalRepeat: 0,
    sortBy: "",
    sortReverse: false,
    SORT: [
      {
        name: "currency",
        sortBy: "base_unit",
        enabled: false,
        class: "text-left"
      },
      { name: "price", sortBy: "last", enabled: true, class: "text-right" },
      { name: "change", sortBy: "change", enabled: true, class: "text-right" }
    ]
  }),
  computed: {
    MARKETS() {
      return [...config.list_bid1, ...config.list_bid2];
    },
    pricePrecision: () => helpers.pricePrecision(),
    findTickers() {
      const { sortBy, sortReverse, isSelected, search } = this;
      const { findTickersBase } = helpers;

      let tickers = this.$store.state.public.tickers;

      tickers = Object.values(tickers);
      tickers = findTickersBase(tickers, "market", isSelected, true);
      if (this.search) {
        tickers = findTickersBase(tickers, "search", search, true);
      }

      tickers = Array.from(tickers).sort((first, second) =>
        String(first[sortBy]).localeCompare(second[sortBy])
      );
      return sortReverse ? tickers.reverse() : tickers;
    }
  },
  created() {
    this.isAsk = helpers.isAskSymbol().toUpperCase();
    this.isBid = helpers.isBidSymbol().toUpperCase();
    this.isSelected = helpers.isBidSymbol().toUpperCase();
    if (config.list_bid2.includes(this.isBid))
      this.isSelectedDrop = this.isBid;
  },
  methods: {
    checkFavorite: ticker => helpers.checkFavorite(ticker),
    addOrRemoveFavorite: ticker => helpers.addOrRemoveFavorite(ticker),
    getPrice(value) {
      const { pricePrecision } = this;

      return Number(value).toFixed(pricePrecision);
    },
    changeSort(sort) {
      if (this.totalRepeat >= 2) {
        this.totalRepeat = 0;
        this.sortBy = "";
        this.sortReverse = false;
      } else {
        if (this.sortBy === sort || this.totalRepeat === 0) {
          this.totalRepeat += 1;
        }
        this.sortBy = sort;
        this.sortReverse = !this.sortReverse;
      }
    },
    isActive: market => market === helpers.isMarket(),
    getNameCurrencies(name) {
      const { currencies } = this.$store.state.public;
      for (var i in currencies) {
        if (currencies[i].id === name.toLowerCase()) {
          return currencies[i].name;
        }
      }
    },
    changeSelect(choice, drop = false) {
      this.isSelected = choice;
      if (drop) this.isSelectedDrop = choice;
    },
    getTrend(change) {
      change = change.replace("%", "");
      return change >= 0 ? "text-up" : "text-down";
    },
    onChangeShow() {
      const old = this.showing;
      this.showing = !old;
    },
    classShow() {
      return this.showing ? "selected" : "unselected";
    },
    MarketReload($market) {
      const marketArray = $market.split("/");
      const market = marketArray.join("_");
      this.$store.commit("public/SYNC_EXCHANGE", market);
    }
  }
};
</script>
