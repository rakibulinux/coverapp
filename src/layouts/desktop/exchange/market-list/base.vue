<template>
  <div class="page-trade-pairs">
    <div class="page-trade-pairs-search-wrapper">
      <input v-model="search" placeholder="Search" maxlength="9" type="text" />
      <a-icon type="search" />
    </div>
    <div class="page-trade-pairs-tabs">
      <span
        class="page-trade-pairs-tab favorites"
        :class="{
          'page-trade-pairs-tab-selected': tab_active_key === 'Favorites'
        }"
        @click="change_tab('Favorites')"
      >
        <i class="ic-star" />
      </span>
      <span
        v-for="(data, index) in MARKET"
        class="page-trade-pairs-tab"
        :key="index"
        :class="{ 'page-trade-pairs-tab-selected': tab_active_key === data }"
        @click="change_tab(data)"
        v-text="data"
      />
    </div>
    <z-table
      :columns="COLUMN"
      :data="findTickers"
      :no-empty="true"
      :hover="true"
      :scroll="true"
      :border="false"
      :selected="{ key: 'id', value: market }"
      @click="on_table_click"
    >
      <template slot="base_unit" slot-scope="{ item, column }">
        <span :class="`currency text-${column.algin}`">
          <span
            :class="[
              'favorite',
              { 'favorite-selected': checkFavorite(item.id) }
            ]"
            @click.stop="addOrRemoveFavorite(item.id)"
          >
            <i class="ic-star"></i>
          </span>
          <span>{{ item.base_unit.toUpperCase() }}</span>
        </span>
      </template>
      <template slot="price_change_percent" slot-scope="{ item, column }">
        <span
          :class="[
            'change',
            `text-${column.algin}`,
            `text-${getMarketPriceChange(item) >= 0 ? 'up' : 'down'}`
          ]"
        >
          {{ item.price_change_percent }}
        </span>
      </template>
    </z-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import store from "@/store";
import * as helpers from "@zsmartex/z-helpers";
import config from "@/config";

@Component
export default class MarketList extends Vue {
  public tab_active_key = helpers.isBidSymbol().toUpperCase();
  public showing = false;
  public search = "";
  public totalRepeat = 0;
  public sortBy = "";
  public sortReverse = false;
  public SORT = [
    {
      name: "currency",
      sortBy: "base_unit",
      enabled: false,
      class: "text-left"
    },
    { name: "price", sortBy: "last", enabled: true, class: "text-right" },
    { name: "change", sortBy: "change", enabled: true, class: "text-right" }
  ];

  public COLUMN = [
    {
      title: "Currency",
      key: "base_unit",
      class_name: "currency",
      algin: "left",
      scopedSlots: true
    },
    {
      title: "Price",
      key: "last",
      class_name: "price",
      algin: "right",
      sorter: true
    },
    {
      title: "Change",
      key: "price_change_percent",
      class_name: "change",
      algin: "right",
      scopedSlots: true,
      sorter: true
    }
  ];

  public MARKET = [...config.list_bid1, ...config.list_bid2];

  get isAsk() {
    return helpers.isAskSymbol();
  }

  get isBid() {
    return helpers.isBidSymbol();
  }

  get market() {
    return helpers.isMarket();
  }

  get pricePrecision() {
    return helpers.pricePrecision();
  }

  get findTickers() {
    const { tab_active_key, search } = this;

    let tickers = Object.values(store.state.public.tickers);

    tickers = helpers.findTickersBase(tickers, "market", tab_active_key, true);
    if (this.search) {
      tickers = helpers.findTickersBase(tickers, "search", search, true);
    }

    return tickers;
  }

  public getMarketPriceChange(market = null) {
    return helpers.getMarketPriceChange(market);
  }

  public checkFavorite(market) {
    return helpers.checkFavorite(market);
  }

  public addOrRemoveFavorite(market) {
    helpers.addOrRemoveFavorite(market);
  }

  public getPrice(value) {
    const { pricePrecision } = this;

    return Number(value).toFixed(pricePrecision);
  }

  public getNameCurrencies(name) {
    const { currencies } = this.$store.state.public;
    for (const i in currencies) {
      if (currencies[i].id === name.toLowerCase()) {
        return currencies[i].name;
      }
    }
  }

  public change_tab(tab: string) {
    this.tab_active_key = tab;
  }

  public on_table_click(item) {
    if (this.market === item.id) {
      return;
    }

    const market = item.name.split("/").join("_");
    store.commit("public/SYNC_EXCHANGE", market);
  }
}
</script>

<style lang="less">
@trade-pairs-prefix-cls: ~"page-trade-pairs";

.@{trade-pairs-prefix-cls} {
  height: 100%;
  background-color: var(--bg-card-color);

  &-search-wrapper {
    position: relative;
    padding: 5px 5px;
    height: 30px;
    width: 100%;
    line-height: 0;

    input {
      border-radius: 3px;
      border: 1px solid var(--border-color);
      height: 100%;
      width: 100%;
      padding-left: 32px;

      &::placeholder {
        color: var(--color-gray);
      }
    }

    i {
      position: absolute;
      left: 8px;
      top: calc(50% - 10px);
      font-size: 20px;
      color: var(--color-gray);
    }
  }

  &-tabs {
    display: flex;
    height: 36px;
    line-height: 36px;
    background: var(--selected-bg-color);

    .@{trade-pairs-prefix-cls}-tab {
      flex: 1 1;
      padding: 0 4px;
      text-align: center;
      border-right: 1px solid #182640;
      cursor: pointer;

      i {
        font-size: 18px;
      }

      &-selected {
        background: var(--blue-color);
      }
    }
  }
}
</style>

<style lang="less">
.page-trade-pairs {
  .z-table-row {
    border-left: 4px solid transparent;
    &-row {
      height: 30px;
      line-height: 30px;
    }

    &-selected {
      border-color: var(--blue-color);
    }

    span.currency {
      > span {
        display: inline-block;
        & + span {
          margin-left: 6px;
        }
      }
    }

    span.favorite {
      text-align: center;
      color: #728bb9;

      &-selected {
        color: var(--blue-color);
      }
      i {
        font-size: 14px;
        vertical-align: baseline;
      }
    }
  }
}
</style>
