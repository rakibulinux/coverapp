<template>
  <div class="order-main">
    <div class="order-head" v-text="$t('orders.open.title')" />
    <div class="order-body">
      <div class="select">
        <!---->
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
      </div>
      <div class="table-content">
        <dt>
          <span v-text="$t('table.date')" />
          <span v-text="$t('table.pair')" />
          <span v-text="$t('table.type')" />
          <span v-text="$t('table.price')" />
          <span v-text="$t('table.amount')" />
          <span v-text="$t('table.executed')" />
          <span v-text="$t('table.unexecuted')" />
          <span class="text-right action" v-text="$t('table.action')" />
        </dt>
        <dd :class="{ empty: !array.data.length }">
          <p v-if="!array.data.length">
            <span v-text="$t('orders.open.empty')" />
          </p>
          <p v-for="(data, index) in array.data" :key="index">
            <span v-text="getDate(data.created_at)" />
            <span
              v-text="$store.getters['public/getAllTickers'][data.market].name"
            />
            <span :class="trendType(data.side)" v-text="data.side" />
            <span v-text="getPrice(data.price, data.market)" />
            <span v-text="getAmount(data.origin_volume, data.market)" />
            <span v-text="getAmount(data.executed_volume, data.market)" />
            <span v-text="getAmount(data.remaining_volume, data.market)" />
            <span class="text-right action">
              <i
                v-if="data.state === 'wait' || data.state === 'pending'"
                class="ic-aui-icon-close"
                @click="CloseOrder(data.id)"
              />
            </span>
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
  mixins: [Helpers],
  methods: {
    async getData(page = 1) {
      this.loading = true;
      const payload = {
        market:
          this.market != "All"
            ? helpers.getTickerID(this.market).toLowerCase()
            : "",
        state: "wait",
        limit: "25",
        type: this.type != "All" ? this.type.toLowerCase() : "",
        page
      };
      try {
        const response = await new ApiClient("trade").get(
          "market/orders",
          payload
        );
        this.array.data = response.data;
        this.array.max = Number(response.headers.total);
        this.loading = false;
      } catch (error) {
        return error;
      }
    },
    async CloseOrder(id) {
      try {
        await this.$store.dispatch("exchange/CANCEL_ORDER", id);
        const index = this.array.data.findIndex(row => row.id === id);
        this.array.data.splice(index, 1);
        this.array.max--;
      } catch (error) {
        return error;
      }
    }
  }
};
</script>
