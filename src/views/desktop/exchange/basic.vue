<template>
  <div :key="identifier" class="page-exchange">
    <div class="page-exchange-group">
      <div class="page-exchange-group" style="display: inline-block;">
        <TickerStatus :button-hide-market-list="true" />
        <div class="page-exchange-group">
          <div class="page-exchange-left">
            <OrderBook />
          </div>
          <div class="page-exchange-center">
            <Chart />
            <TradeAction />
          </div>
        </div>
      </div>
      <div class="page-exchange-right">
        <MarketList />
        <z-card v-model="trades_tab_active_key" class="trades" :tab-list="tradesTabList">
          <MarketTrades :loading="loading" v-show="trades_tab_active_key == 'market_trades'" />
          <MyTrades v-show="trades_tab_active_key == 'my_trades'" />
        </z-card>
      </div>
    </div>
    <MineControl />
  </div>
</template>

<script lang="ts">
import { ExchangeBaseMixin } from '@/mixins/exchange';
import { Component, Mixins } from 'vue-property-decorator'

@Component({
  components: {
    MarketList: () => import("@/layouts/desktop/exchange/market-list"),
    TickerStatus: () => import("@/layouts/desktop/exchange/_ticker.vue"),
    OrderBook: () => import("@/layouts/desktop/exchange/orderbook"),
    Chart: () => import("@/layouts/desktop/exchange/chart"),
    MineControl: () =>
      import("@/layouts/desktop/exchange/_mine_control.vue"),
    MarketTrades: () =>
      import("@/layouts/desktop/exchange/_market_trades.vue"),
    MyTrades: () =>
      import("@/layouts/desktop/exchange/MyTrades.vue"),
    TradeAction: () => import("@/layouts/desktop/exchange/trade-action"),
  }
})
export default class PageExchangePro extends Mixins(ExchangeBaseMixin) {
  trades_tab_active_key = "market_trades";

  tradesTabList = [
    {
      key: "market_trades",
      text: "Market Trades",
    },
    {
      key: "my_trades",
      text: "My Trades"
    }
  ]
}
</script>

<style lang="less">
@ticker-status-height: 67px;
@left-right-width: 325px;
@orderbook-height: 800px;
@market-list-height: 475px;
@chart-height: 520px;

.basic {
  .page-exchange {
    max-width: 1600px;
    min-width: 1280px;
    height: auto;
    margin: 0 auto;
    display: block;

    &-group {
      display: flex;
      height: 100%;
      width: 100%;
      justify-content: space-between;

      > * {
        display: inline-block;
        width: 100%;
      }

      .page-exchange-group {
        display: flex;
      }
    }

    &-left, &-right {
      width: @left-right-width;
      height: 100%;
    }

    &-center {
      width: calc(100% - (@left-right-width + 8px));
      height: 100%;
    }

    &-right {
      height: @orderbook-height + @ticker-status-height + 4px;
      margin-left: 8px;
    }

    .ticker-info {
      display: flex;
      height: @ticker-status-height;
      margin-bottom: 4px;
    }

    .orderbook {
      width: @left-right-width;
      height: @orderbook-height;

      .depth-overlay-content {
        transform: translateX(103%) translateY(-50%);
      }
    }

    &-chart {
      width: 100%;
      height: @chart-height;
    }

    .trade-action {
      margin-top: 8px;
      width: 100%;
      height: calc(100% - @chart-height - 8px);
    }

    .page-trade-pairs {
      width: @left-right-width;
      height: @market-list-height;

      .z-table {
        min-height: calc(100% - 66px);
      }
    }

    .trades {
      margin-top: 8px;
      width: @left-right-width;
      height: calc(100% - @market-list-height - 8px);

      .market-trades, .my-trades {
        width: 100%;
        height: 100%;
      }
    }

    .page-trade-mine-control {
      display: block;
      width: 100%;
      height: 350px;
      margin-top: 8px;
    }
  }
}
</style>
