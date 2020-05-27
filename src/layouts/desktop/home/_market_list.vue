<template>
  <div class="market-list">
    <div class="menu-table">
      <ul>
        <li
          :class="{
            selected: isSelected === 'Favorites'
          }"
          @click="changeSelect('Favorites')"
        >
          {{ $t("market_list.favorite") }}
        </li>
        <li
          v-for="(data, index) in list_bid"
          :key="index"
          :class="{ selected: isSelected === data }"
          @click="changeSelect(data)"
        >
          {{ $t("market_list.market", { market: data }) }}
        </li>
      </ul>
      <div class="search">
        <input
          v-model="search"
          :placeholder="$t('table.search')"
          maxlength="9"
          type="text"
        />
        <a-icon type="search" />
      </div>
    </div>
    <div class="ex_table table_noscroll">
      <dt>
        <span
          v-for="(data, index) in sorts"
          :key="index"
          class="text-left"
          @click="changeSort(data.sortBy)"
        >
          <span>{{ $t("table." + data.text) }}</span>
          <span class="sorter">
            <i
              v-if="sortBy === data.sortBy && !sortReverse"
              class="ic-arrow-caret-up"
            />
            <i
              v-if="sortBy === data.sortBy && sortReverse"
              class="ic-arrow-caret-down"
            />
          </span>
        </span>
        <span class="text-right actions">{{ $t("table.action") }}</span>
      </dt>
      <dd>
        <p
          v-for="(data, index) in findTickers"
          :key="index"
          @click="MarketJoin(data.name)"
        >
          <i
            v-if="!checkFavorite(data.name)"
            class="ic-no-star"
            @click.stop="addOrRemoveFavorite(data.name)"
          />
          <i
            v-else
            class="ic-star"
            @click.stop="addOrRemoveFavorite(data.name)"
          />
          <span class="text-left">{{ data.name }}</span>
          <span
            class="text-left last"
            :class="getTrend(data.price_change_percent)"
          >
            {{ getPrice(data.last) }}
            <i class="price-usd">
              ≈ $
              {{ getLastPriceUSD(data.base_unit + data.quote_unit, data.last) }}
            </i>
          </span>
          <span
            class="text-left"
            :class="getTrend(data.price_change_percent)"
            v-text="data.price_change_percent"
          />
          <span class="text-left">{{ getPrice(data.high) }}</span>
          <span class="text-left">{{ getPrice(data.low) }}</span>
          <span class="text-left">
            {{
              Number(
                Number(data.volume).toFixed(totalPrecision)
              ).toLocaleString()
            }}
          </span>
          <span class="text-right actions" @click.stop="MarketJoin(data.name)">
            <img src="@/assets/img/action_exchange.png" />
          </span>
        </p>
      </dd>
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import config from "@/config";

export default {
  data: () => ({
    isSelected: "",
    search: "",
    sortBy: "volume",
    sortReverse: false,
    sorts: [
      { sortBy: "name", text: "pair" },
      { sortBy: "last", text: "last_price" },
      { sortBy: "change", text: "24h_change" },
      { sortBy: "high", text: "24h_high" },
      { sortBy: "low", text: "24h_low" },
      { sortBy: "volume", text: "24h_volume" }
    ]
  }),
  computed: {
    list_bid() {
      return [...config.list_bid1, ...config.list_bid2];
    },
    pricePrecision: () => helpers.pricePrecision(),
    totalPrecision: () => helpers.totalPrecision(),
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
  mounted() {
    this.isSelected = config.list_bid1[0];
  },
  methods: {
    getPrice(value) {
      const { pricePrecision } = this;

      return Number(value).toFixed(pricePrecision);
    },
    checkFavorite: ticker => helpers.checkFavorite(ticker),
    addOrRemoveFavorite: ticker => helpers.addOrRemoveFavorite(ticker),
    getLastPriceUSD: (ticker, last) => helpers.getTickerPriceUSD(ticker, last),
    getTrend(price_change_percent) {
      const chance = price_change_percent.split("%")[0];
      return chance >= 0 ? "text-up" : "text-down";
    },
    getNameCurrencies(currency) {
      const currencies = this.$store.getters["public/getAllCurrencies"];
      for (const i in currencies) {
        if (currencies[i].id === currency) {
          return currencies[i].name;
        }
      }
    },
    changeSort(sortBy) {
      if (this.sortBy != sortBy) {
        this.sortBy = sortBy;
        this.sortReverse = false;
        return;
      }
      this.sortReverse = !this.sortReverse;
    },
    changeSelect(symbol) {
      this.isSelected = symbol;
    },
    MarketJoin($market) {
      const marketArray = $market.split("/");
      const market = marketArray.join("_");
      this.$store.commit("public/SYNC_EXCHANGE", market);
    }
  }
};
</script>
