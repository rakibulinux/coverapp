<template>
  <panel-view v-if="isShowing" class="screen-personal-m my-orders">
    <head-bar :loading="isLoading" title="My Orders" @on-remove="remove()" />
    <div class="body-bar">
      <div class="order-setting">
        <div class="choose-market">
          <choose-completer
            ref="market"
            :data="MARKET"
            :selected="MARKET[market].value"
            :selected-text="getMarketSelected"
            @on-change="changeMarket"
          />

          <choose-picker
            ref="state"
            :data="STATE"
            :selected="STATE[state].value"
            :selected-text="getStateSelected"
            @on-change="changeState"
          />
        </div>
        <div class="cancel-all">
          <button @click="cancelAllOrder">
            Cancel All
          </button>
        </div>
      </div>
      <order-list>
        <order-row
          v-for="(order, index) in orders_history.data"
          :key="index"
          :order="order"
          :cancel-order="cancelOrder"
        />
        <a-pagination
          v-if="orders_history.max > 25"
          v-model="orders_history.page"
          size="small"
          class="text-right"
          :page-size="size"
          :total="orders_history.max"
          @change="getData"
        />
      </order-list>
    </div>
  </panel-view>
</template>

<script lang="ts">
import store from "@/store";
import { Vue, Component } from "vue-property-decorator";
import Helpers from "../helpers";

@Component({
  components: {
    "order-row": () => import("./modules/order-row.vue"),
    "order-list": () => import("./modules/order-list.vue"),
    "choose-completer": () =>
      import("@/components/mobile/choose-completer.vue"),
    "choose-picker": () => import("@/components/mobile/choose-picker.vue")
  },
  mixins: [Helpers]
})
export default class App extends Vue {
  public market = "All";
  public size = 25;
  public state = "All";

  public STATE = {
    All: {
      name: "All",
      value: "All"
    },
    wait: {
      name: "Waiting",
      value: "wait"
    },
    done: {
      name: "Filled",
      value: "done"
    },
    cancel: {
      name: "Canceled",
      value: "cancel"
    }
  };

  get orders_history() {
    const { orders_history } = this.$store.state.exchange.mine_control;

    return orders_history;
  }

  get MARKET() {
    const value = { All: { name: "All", value: "All" } };
    const MARKET = store.getters["public/getAllMarkets"];
    MARKET.forEach(market => {
      value[market.id] = {
        name: market.name,
        value: market.id
      };
    });
    return value;
  }
  get getMarketSelected() {
    return this.market === "All" ? "Symbol" : this.MARKET[this.market].name;
  }
  get getStateSelected() {
    return this.state === "All" ? "Status" : this.STATE[this.state].name;
  }
  get isLoading() {
    return this.$store.getters["exchange/loadingStatus"];
  }

  public changeMarket(market) {
    this.market = market;
    this.getData();
  }
  public changeState(state) {
    this.state = state;
    this.getData();
  }
  public async cancelAllOrder() {
    //TODO: add logic to cancel all orders
    return;
  }
  public async cancelOrder(id) {
    await this.$store.dispatch("exchange/CANCEL_ORDER", id);
  }
  public onRender() {
    this.getData();
  }
  public async getData(page = 1) {
    const { market, size, state } = this;
    await this.$store.dispatch("exchange/getOrdersHistory", {
      market,
      size,
      state,
      page
    });
  }
}
</script>
