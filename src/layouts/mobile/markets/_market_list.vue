<template>
  <div class="body-bar ex_table">
    <dt>
      <span class="text-left">Pair / Vol</span>
      <span class="text-left">Last Price</span>
      <span class="text-right">24h Chg%</span>
    </dt>
    <cube-tab-panels v-model="selected">
      <cube-tab-panel
        v-for="item in ['Favorites', ...list_bid]"
        :key="item"
        :label="item"
      >
        <pull-to :last-update="lastUpdate" :top-load-method="refresh">
          <dd>
            <p
              v-for="(data, index) in findTickers('market', item)"
              :key="index"
              @click="showPanel(data)"
            >
              <span class="text-left pair">
                <div class="name">
                  <span>{{ data.base_unit.toUpperCase() }}</span>
                  <span>/ {{ data.quote_unit.toUpperCase() }}</span>
                </div>
                <div class="vol">
                  Vol: {{ getAmount(data.volume, data.name) }}
                </div>
              </span>
              <span class="text-left last">
                <div class="coin" :class="getTrend(data.price_change_percent)">
                  {{ getPrice(data.last, data.name) }}
                </div>
                <div class="fait">
                  $
                  {{
                    getLastPriceUSD(data.base_unit + data.quote_unit, data.last)
                  }}
                </div>
              </span>
              <span class="text-right rate">
                <div
                  :class="
                    getTrend(percentToNumber(data.price_change_percent), true)
                  "
                >
                  {{ data.price_change_percent }}
                </div>
              </span>
            </p>
          </dd>
        </pull-to>
      </cube-tab-panel>
    </cube-tab-panels>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import store from "@/store";
import config from "@/config";
import * as helpers from "@zsmartex/z-helpers";
import PullTo from "@/components/mobile/pull-to";

@Component({
  props: {
    selected: String,
    findTickers: Function,
    checkFavorite: Function,
    percentToNumber: Function,
    getTrend: Function,
    getPrice: Function,
    getAmount: Function
  },
  components: {
    "pull-to": PullTo
  }
})
export default class MarketList extends Vue {
  get lastUpdate() {
    return store.state.public.lastUpdate;
  }

  get list_bid() {
    return [...config.list_bid1, ...config.list_bid2];
  }

  async refresh(loaded) {
    try {
      await store.dispatch("public/getTimeStamp");
      await store.dispatch("public/getMarkets");
      await store.dispatch("public/getTickers");
      loaded("done");
    } catch (error) {
      loaded("failed");
      return error;
    }
  }

  getLastPriceUSD(ticker, last) {
    return helpers.getTickerPriceUSD(ticker, last);
  }

  showPanel(value) {
    this.$emit("on-open-screen", {
      methods: "setMarket",
      data: value
    });
  }
}
</script>
