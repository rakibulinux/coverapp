<template>
  <div class="body-bar ex_table">
    <dt>
      <span class="text-left">Search results:</span>
    </dt>
    <dd>
      <p
        v-for="(data, index) in findTickers('search', value)"
        :key="index"
        @click="openMarketPreview(data)"
      >
        <span
          class="text-left pair"
          v-text="[data.base_unit, data.quote_unit].join(' / ').toUpperCase()"
        />
        <span class="text-left last">
          <span class="price" v-text="data.last" />
          <span
            class="chance"
            :class="getTrend(percentToNumber(data.price_change_percent))"
            v-text="data.price_change_percent"
          />
        </span>
        <span class="text-right favorite-action">
          <i
            v-if="checkFavorite(data.name)"
            class="ic-star"
            @click.stop="addOrRemoveFavorite(data.name)"
          />
          <i
            v-else
            class="ic-no-star"
            @click.stop="addOrRemoveFavorite(data.name)"
          />
        </span>
      </p>
    </dd>
  </div>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";

export default {
  props: {
    value: [String, Number],
    findTickers: Function,
    getTrend: Function,
    percentToNumber: Function,
    checkFavorite: Function,
    addOrRemoveFavorite: Function
  },
  methods: {
    openMarketPreview(market) {
      ZSmartModel.emit("open-market-preview", {
        methods: "setMarket",
        data: market
      });
    }
  }
};
</script>
