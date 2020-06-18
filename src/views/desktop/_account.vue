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
          <span v-text="$t(data.text)"/>
        </router-link>
      </ul>
      <router-view />
    </div>
  </z-content>
</template>

<script>
export default {
  data() {
    return {
      MENU: [
        {
          icon: "ic-personal",
          text: "usercenter.account_information.title",
          url: "/account/information"
        },
        {
          icon: "ic-anquan",
          text: "usercenter.account_security.title",
          url: "/account/security"
        },
        {
          icon: "ic-shenfen",
          text: "header.user.kyc_account_verification",
          url: "/account/kyc"
        },
        {
          icon: "ic-rili",
          text: "usercenter.login_history.title",
          url: "/account/history"
        },
        {
          icon: "ic-API",
          text: "usercenter.api.title",
          url: "/account/api"
        }
      ]
    }
  }
}
</script>