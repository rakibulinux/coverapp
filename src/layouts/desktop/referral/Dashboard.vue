<template>
  <div class="page-referral-dashboard">
    <div class="page-referral-dashboard-period">
      <a-button
        v-for="(p, index) in periods"
        :key="index"
        type="primary"
        class="page-referral-dashboard-period-item"
        :ghost="p.period == period"
        @click="period = p.period"
      >
        {{ p.text }}
      </a-button>
    </div>
    <div class="page-referral-dashboard-content">
      <z-loading v-if="loading" />
      <template>
        <span>
          <div class="title">You Earned</div>
          <span class="value">{{ earned_btc }} BTC</span>
        </span>
        <span>
          <div class="title">Friend Trade</div>
          <span class="value">{{ friend_trade }}</span>
        </span>
        <span>
          <div class="title">Friend</div>
          <span class="value">{{ friend }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import ApiClient from '@zsmartex/z-apiclient';
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Dashboard extends Vue {
  loading = false;
  period = 1;
  release_commissions = Array<ZTypes.ReleaseCommission>();
  periods = [
    {
      period: 1,
      text: "Yesterday"
    },
    {
      period: 7,
      text: "One Week"
    },
    {
      period: 30,
      text: "One Moth"
    }
  ];

  get earned_btc() {
    let earned_btc = 0;

    this.release_commissions.forEach(release_commission => {
      earned_btc += Number(release_commission.earned_btc);
    });

    return earned_btc.toFixed(8)
  }

  get friend_trade() {
    let friend_trade = 0;

    this.release_commissions.forEach(release_commission => {
      friend_trade += release_commission.friend_trade;
    });

    return friend_trade
  }

  get friend() {
    let friend = 0;

    this.release_commissions.forEach(release_commission => {
      friend += release_commission.friend;
    });

    return friend
  }

  mounted() {
    this.fetch_release_commissions();
  }

  async fetch_release_commissions() {
    this.loading = true;

    try {
      const { data } = await new ApiClient("finex").get("referral");
      this.release_commissions = data;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  @Watch("period")
  onPeriodChanged(_, old_period) {
    if (this.loading) {
      this.period = old_period;
      return;
    }

    this.fetch_release_commissions();
  }
}
</script>
