<template>
  <panel-view v-if="isShowing" class="screen-personal-m dw-history">
    <head-bar title="D/W History" :loading="loading" @on-remove="remove()" />
    <div class="body-bar">
      <div class="history-setting">
        <choose-completer
          ref="market"
          :data="CURRENCY"
          :selected="CURRENCY[currency].value"
          :selected-text="getCurrencySelected"
          @on-change="changeCurrency"
        />
        <choose-picker
          ref="type"
          :data="TYPE"
          :selected="type"
          :selected-text="TYPE[type].name"
          @on-change="changeType"
        />
      </div>
      <div class="dw-history-list">
        <history-row
          v-for="(data, index) in history.data"
          :key="index"
          :data="data"
          @click="openHistoryPanel"
        />
      </div>
    </div>
    <history-panel ref="history-panel" :type="type" :data="payload_panel" />
  </panel-view>
</template>

<script>
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "../helpers";
import _history_row from "./modules/history-row";
import _history_panel from "./history-panel";
import _choose_completer from "@/components/mobile/choose-completer";
import _choose_picker from "@/components/mobile/choose-picker";

export default {
  components: {
    "history-row": _history_row,
    "history-panel": _history_panel,
    "choose-completer": _choose_completer,
    "choose-picker": _choose_picker
  },
  mixins: [Helpers],
  data: () => ({
    loading: false,
    currency: "All",
    type: "deposits",
    history: {
      data: [],
      page: 1,
      max: 0
    },
    payload_panel: {}
  }),
  computed: {
    TYPE: () => ({
      deposits: {
        name: "Deposit",
        value: "deposits"
      },
      withdraws: {
        name: "Withdrawal",
        value: "withdraws"
      }
    }),
    CURRENCY() {
      const currencies = new helpers.Currency().DATA;

      const value = {
        All: {
          name: "All",
          value: "All"
        }
      };
      currencies.forEach(currency => {
        value[currency.id] = {
          name: currency.id.toUpperCase(),
          value: currency.id,
          info: currency.name
        };
      });

      return value;
    },
    getCurrencySelected() {
      return this.currency === "All"
        ? "Currencies"
        : this.CURRENCY[this.currency].value.toUpperCase();
    }
  },
  methods: {
    changeType(type) {
      this.type = type;
      this.getData();
    },
    changeCurrency(currency) {
      this.currency = currency;
      this.getData();
    },
    openHistoryPanel(data) {
      this.payload_panel = data;
      this.$refs["history-panel"].render();
    },
    onRender() {
      this.getData();
    },
    async getData() {
      const { type } = this;
      const payload = this.buildPayload();

      this.history.data = [];
      this.loading = true;
      try {
        const response = await new ApiClient("trade").get(
          "account/" + type,
          payload
        );
        this.history.data = response.data;
        this.history.max = response.headers.total;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        return error;
      }
    },
    buildPayload() {
      return {
        currency: this.currency != "All" ? this.currency.toLowerCase() : "",
        limit: 25,
        page: this.history.page
      };
    }
  }
};
</script>
