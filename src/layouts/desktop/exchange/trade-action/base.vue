<template>
  <z-card
    :bordered="false"
    :tab-list="tabList"
    :active-tab-key="selected"
    class="trade-action"
    @tabChange="onTabChange"
  >
    <trade-action-part side="buy" />
    <trade-action-part side="sell" />
    <modal-exchange v-if="!$store.getters['user/isLoggedIn']" />
  </z-card>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import _modal from "@/components/desktop/exchange/_modal.vue";

export default {
  components: {
    "trade-action-part": () => import("./trade-action-part.vue"),
    "modal-exchange": _modal,
  },
  data: () => ({
    tabList: [
      {
        key: "limit",
        tab: "Limit Order",
      },
    ],
    selected: "limit",
  }),
  methods: {
    onTabChange(type) {
      this.selected = type;
    },
    translation: (message, data = {}) =>
      helpers.translation("exchange." + message, data),
  },
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
        background-color: #3b4861 !important;
      }

      &-dot {
        top: -3px;
        background-color: #3b4861;
        width: 10px;
        height: 10px;
      }

      &-handle {
        height: 16px;
        width: 16px;
        margin-top: -6px;
        border: 3px solid;
      }

      &-track {
        background-color: #586886 !important;
      }
    }

    &-buy {
      .ant-slider {
        &-dot {
          border: 1px solid var(--bg-color);
          &-active {
            background-color: var(--up-color);
          }
        }
        &-handle {
          background-color: var(--bg-card-color);
          border-color: var(--up-color);
          &:hover {
            box-shadow: 0 0 0 7px rgba(18, 184, 134, 0.15);
          }
          &:focus {
            box-shadow: 0 0 0 7px rgba(18, 184, 134, 0.15);
          }
        }
      }
    }

    &-sell {
      .ant-slider {
        &-dot {
          border: 1px solid var(--bg-color);
          &-active {
            background-color: var(--down-color);
          }
        }
        &-handle {
          background-color: var(--bg-card-color);
          border-color: var(--down-color);
          &:hover {
            box-shadow: 0 0 0 7px rgba(250, 82, 82, 0.15);
          }
          &:focus {
            box-shadow: 0 0 0 7px rgba(250, 82, 82, 0.15);
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
