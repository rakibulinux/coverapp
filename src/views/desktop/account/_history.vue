<template>
  <div class="setting-main history">
    <div class="setting-head">
      {{ $t("usercenter.login_history.title") }}
    </div>
    <div class="setting-body">
      <table class="table table-head">
        <thead>
          <th class="text-left" v-text="$t('table.date')" />
          <th class="text-center" v-text="$t('table.ip_address')" />
          <th class="text-right" v-text="$t('table.status')" />
        </thead>
      </table>
      <div class="table-content">
        <table class="table">
          <tbody>
            <tr
              v-for="(data, index) in activity.array"
              :key="index"
              class="history-row"
            >
              <td class="text-left" v-text="getDate(data.created_at)" />
              <td class="text-center" v-text="data.user_ip" />
              <td class="text-right">
                {{ $t(`history.${data.action}`) }}
                {{ $t(`history.${data.result}`) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <a-spin v-if="isLoading" size="large">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
      <a-pagination
        size="small"
        :current="activity.page"
        :page-size="25"
        :total="activity.max"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("user", ["activity"]),
    isLoading() {
      return this.activity.loading;
    }
  },
  mounted() {
    if (!this.activity.loading)
      this.$store.dispatch("user/GET_ACTIVITY", {
        limit: 25,
        page: 1,
        topic: "session",
        action: "login"
      });
  },
  methods: {
    onPageChange($page) {
      this.$store.dispatch("user/GET_ACTIVITY", {
        page: $page,
        limit: 25,
        topic: "session",
        action: "login"
      });
    },
    getDate: date => helpers.getDate(date, true)
  }
};
</script>
