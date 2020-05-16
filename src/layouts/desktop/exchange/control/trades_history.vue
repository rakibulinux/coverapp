<template>
  <div id="trades_history" class="ex_table">
    <dt>
      <span class="text-left date" v-text="$t('table.date')" />
      <!--<span class="text-left type" v-text="$t('table.type')" />-->
      <span class="text-left side" v-text="$t('table.side')" />
      <span class="text-center price">
        {{ $t("table.price") }} ({{ isBid }})
      </span>
      <span class="text-right amount">
        {{ $t("table.amount") }} ({{ isAsk }})
      </span>
      <span class="text-right total">
        {{ $t("table.total") }} ({{ isBid }})
      </span>
    </dt>
    <modal-exchange
      v-if="!$store.getters['user/isLoggedIn']"
      background="transparent"
    />
    <dd v-else-if="mine_control.max > 0" class="all">
      <p v-for="data in mine_control.data" :key="data.id">
        <span class="text-left date" v-text="getDate(data.created_at)" />
        <!--<span class="text-left type" v-text="'limit'" />-->
        <span
          class="text-left side"
          :class="getTrend(data.side)"
          v-text="data.side"
        />
        <span class="text-center price" v-text="getPrice(data.price)" />
        <span class="text-right amount" v-text="getAmount(data.amount)" />
        <span class="text-right amount" v-text="getTotal(data.total)" />
      </p>
    </dd>
    <modal-empty v-else :content="$t('orders.transaction.empty')" />
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
