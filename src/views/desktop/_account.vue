<template>
  <z-content class="page-user">
    <div class="container">
      <ul class="setting-menu">
        <li class="avatar-user">
          <img src="@/assets/img/avatar.png" />
          <p class="uid">UID: {{ $store.state.user.uid }}</p>
          <div class="email">{{ $store.state.user.email }}</div>
        </li>
        <router-link
          v-for="(data, index) in MENU"
          :key="index"
          tag="li"
          :to="data.url"
          :class="{ selected: $route.path === data.url }"
          class="pick"
        >
          <i :class="data.icon" />
          <span v-text="data.text" />
        </router-link>
      </ul>
      <router-view />
    </div>
  </z-content>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Account extends Vue {
  get MENU() {
    return [
      {
        icon: "ic-personal",
        text: this.$t("usercenter.account_information.title"),
        url: "/account/information"
      },
      {
        icon: "ic-anquan",
        text: this.$t("usercenter.account_security.title"),
        url: "/account/security"
      },
      {
        icon: "ic-shenfen",
        text: this.$t("header.user.kyc_account_verification"),
        url: "/account/kyc"
      },
      {
        icon: "ic-rili",
        text: this.$t("usercenter.login_history.title"),
        url: "/account/history"
      },
      {
        icon: "ic-API",
        text: this.$t("usercenter.api.title"),
        url: "/account/api"
      }
    ];
  }
}
</script>
