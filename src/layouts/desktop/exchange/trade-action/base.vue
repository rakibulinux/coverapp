<template>
  <z-card
    :bordered="false"
    :tab-list="tabList"
    :active-tab-key="ord_type"
    class="trade-action"
    @tabChange="onTabChange"
  >
    <trade-action-part side="buy" :ord_type="ord_type" />
    <trade-action-part side="sell" :ord_type="ord_type" />
    <modal-exchange v-if="!$store.getters['user/isLoggedIn']" />
  </z-card>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "trade-action-part": () => import("./trade-action-part.vue"),
    "modal-exchange": () => import("@/components/desktop/exchange/_modal.vue")
  }
})
export default class TradeAction extends Vue {
  ord_type = "limit";

  get tabList() {
    return [
      {
        key: "limit",
        tab: this.translation("limit_order")
      },
      {
        key: "market",
        tab: this.translation("market_order")
      }
    ]
  }

  onTabChange(type) {
    this.ord_type = type;
  }

  translation(message, data = {}) {
    return helpers.translation("page.exchange.trade_action." + message, data)
  }
};
</script>

<style lang="less">
.trade-action {
  height: 275px;
  margin-top: 4px;
  &-part {
    position: relative;
    display: inline-block;
    width: 50%;
    height: 100%;
    padding: 12px;
    padding-top: 0;

    .total {
      color: var(--color-gray);
      margin-bottom: 8px;

      .value {
        color: white;
      }
    }
  }

  &-balance {
    line-height: 18px;
    padding: 8px 0;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-title {
      font-weight: bold;
    }

    &-action {
      font-size: 14px;
    }
  }
  &-input {
    &.amount {
      margin-top: 12px;
    }
  }

  &-slider {
    margin: 20px 6px;
    .ant-slider {
      &-rail {
        background-color: var(--border-color) !important;
      }

      &-dot {
        top: -3px;
        background-color: var(--border-color);
        width: 10px;
        height: 10px;
      }

      &-handle {
        height: 16px;
        width: 16px;
        margin-top: -6px;
        border-width: 3px;
        background-color: var(--border-color);
      }

      &-track {
        background-color: #586886 !important;
      }
    }

    &-buy,
    &-sell {
      .ant-slider {
        &-dot {
          border-color: var(--color-gray) !important;
        }
      }
    }

    &-buy {
      .ant-slider {
        &-dot {
          &-active {
            background-color: var(--up-color);
          }
        }
        &-handle {
          border-color: var(--up-color) !important;
          &:hover,
          &:focus {
            box-shadow: 0 0 0 7px rgba(46, 228, 178, 0.25);
          }
        }
      }
    }

    &-sell {
      .ant-slider {
        &-dot {
          &-active {
            background-color: var(--down-color);
          }
        }
        &-handle {
          border-color: var(--down-color) !important;
          &:hover,
          &:focus {
            box-shadow: 0 0 0 7px var(--down-bg-color);
          }
        }
      }
    }
  }

  &-button {
    width: 100%;
    height: 35px;
    border-radius: 4px;

    &:disabled {
      opacity: 0.75;
    }

    &-buy {
      background-color: var(--up-color);
    }
    &-sell {
      background-color: var(--down-color);
    }
  }
}
</style>
