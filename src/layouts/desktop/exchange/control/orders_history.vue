<template>
  <div id="orders_history" class="ex_table">
    <dt>
      <span class="text-left date" v-text="$t('table.date')" />
      <span class="text-left type" v-text="$t('table.type')" />
      <span class="text-left side" v-text="$t('table.side')" />
      <span class="text-center price">
        {{ $t("table.price") }} ({{ isBid }})
      </span>
      <span class="text-right amount">
        {{ $t("table.amount") }} ({{ isAsk }})
      </span>
      <span class="text-right filled">
        {{ $t("table.filled") }}
      </span>
      <span class="text-right total">
        {{ $t("table.total") }} ({{ isBid }})
      </span>
      <span class="text-right action" />
    </dt>
    <modal-exchange
      v-if="!$store.getters['user/isLoggedIn']"
      background="transparent"
    />
    <dd v-else-if="mine_control.max > 0" class="all">
      <p v-for="data in mine_control.data" :key="data.id">
        <span class="text-left date" v-text="getDate(data.created_at)" />
        <span class="text-left type" v-text="data.ord_type" />
        <span
          class="text-left side"
          :class="getTrend(data.side)"
          v-text="data.side"
        />
        <span class="text-center price" v-text="getPrice(data.price)" />
        <span
          class="text-right amount"
          v-text="getAmount(data.origin_volume)"
        />
        <span
          class="text-right filled"
          v-text="
            (100 - (data.remaining_volume / data.origin_volume) * 100).toFixed(
              2
            )
          "
        />
        <span
          class="text-right total"
          v-text="getTotal(data.price * data.origin_volume)"
        />
        <span class="text-right action">
          <i
            v-if="data.state === 'wait'"
            class="ic-aui-icon-close"
            @click="$store.dispatch('exchange/CANCEL_ORDER', data.id)"
          />
        </span>
      </p>
    </dd>
    <modal-empty v-else :content="$t('orders.history.empty')" />
    <a-spin v-if="isLoading" size="large">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
    </a-spin>
  </div>
</template>

<script>
import Helpers from "./helpers";

export default {
  mixins: [Helpers]
};
</script>
