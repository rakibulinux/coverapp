<template>
  <div class="body-bar z-table z-table-no-scroll">
    <div class="z-table-head">
      <span>Search result:</span>
    </div>
    <div class="z-table-content">
      <div
        class="z-table-row"
        v-for="market in findTickers('search', value)"
        :key="market.id"
        @click="$emit('click', market)"
      >
        <span class="text-left">{{ market.name.replace("/", " / ") }}</span>
        <span class="text-left last">
          <span class="price" v-text="market.last" />
          <span
            class="chance"
            :class="getTrend(market.price_change_percent)"
            v-text="market.price_change_percent"
          />
        </span>
        <span class="text-right favorite-action">
          <a-icon
            type="star"
            :theme="checkFavorite(market.name) ? 'filled' : 'outlined'"
            @click.stop="addOrRemoveFavorite(market.name)"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins, Prop } from "vue-property-decorator";

@Component
export default class SearchMarketScreenBodyBar extends Mixins(MarketMixin) {
  @Prop() readonly value!: string;
}
</script>
