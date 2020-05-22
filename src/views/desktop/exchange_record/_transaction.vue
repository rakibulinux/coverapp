<template>
  <div class="order-main">
    <div class="order-head" v-text="$t('orders.transaction.title')" />
   <div class="order-body">
      <div class="select">
        <div class="form-row">
          <label class="form-label">{{ $t("table.market") }}:</label>
          <div class="form-control">
            <a-select v-model="market" style="width:115px">
              <a-select-option v-for="data in MARKET" :key="data" :value="data">
                {{ data }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">{{ $t("table.type") }}:</label>
          <div class="form-control">
            <a-select v-model="type" style="width:115px">
              <a-select-option v-for="data in TYPE" :key="data">
                {{ data }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">{{ $t("table.date") }}:</label>
          <div class="form-control datepicker">
            <a-range-picker v-model="timeMoment">
              <template slot="dateRender" slot-scope="current">
                <div
                  class="ant-calendar-date"
                  :style="getCurrentStyle(current)"
                >
                  {{ current.date() }}
                </div>
              </template>
            </a-range-picker>
          </div>
        </div>
        <div class="form-row">
          <div class="form-control">
            <button type="submit" @click="getData()">
              Query
            </button>
          </div>
        </div>
      </div>
      <div class="table-content">
        <dt>
          <span v-text="$t('table.date')" />
          <span v-text="$t('table.pair')" />
          <span v-text="$t('table.type')" />
          <span v-text="$t('table.price')" />
          <span v-text="$t('table.amount')" />
          <span v-text="$t('table.total')" />
        </dt>
        <dd :class="{ empty: !array.data.length }">
          <p v-if="!array.data.length">
            <span v-text="$t('orders.transaction.empty')" />
          </p>
          <p
            v-for="(data, index) in array.data"
            :key="index"
            :removing="!!data.removing"
          >
            <span v-text="getDate(data.created_at)" />
            <span
              v-text="$store.getters['public/getAllTickers'][data.market].name"
            />
            <span :class="[trendType(data.side), 'type']" v-text="data.side" />
            <span v-text="getPrice(data.price, data.market)" />
            <span v-text="getAmount(data.amount, data.market)" />
            <span v-text="getTotal(data.total, data.market)" />
          </p>
          <a-spin v-if="loading" size="large">
            <a-icon
              slot="indicator"
              type="loading"
              style="font-size: 24px"
              spin
            />
          </a-spin>
        </dd>
      </div>
      <a-pagination
        v-model="array.page"
        size="small"
        class="text-right"
        :page-size="25"
        :total="array.max"
        @change="getData"
      />
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "./helpers";

export default {
  components: {},
  mixins: [Helpers],
  data: () => ({
    timeMoment: [],
    time: [null, null]
  }),
  watch: {
    timeMoment() {
      const { timeMoment } = this;
      this.time = timeMoment.map(row => new Date(row._d) / 1000);
    }
  },
  methods: {
    getCurrentStyle(current, today) {
      const style = {};
      if (current.date() === 1) {
        style.border = "1px solid var(--blue-color)";
        style.borderRadius = "50%";
      }
      return style;
    },
    async getData(page = 1, limit = 25) {
      this.loading = true;
      const market =
        this.market != "All"
          ? helpers.getTickerID(this.market).toLowerCase()
          : "";
      const payload = {
        market,
        type: this.type != "All" ? this.type.toLowerCase() : "",
        time_from: this.time[0] ? new Date(this.time[0]).getTime() / 1000 : "",
        time_to: this.time[1] ? new Date(this.time[1]).getTime() / 1000 : "",
        limit,
        page
      };
      try {
        const response = await new ApiClient("trade").get(
          "market/trades",
          payload
        );
        this.array.data = response.data;
        this.array.max = Number(response.headers.total);
        this.loading = false;
      } catch (error) {
        return error;
      }
    }
  }
};
</script>
