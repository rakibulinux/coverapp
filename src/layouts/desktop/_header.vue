<template>
  <div class="ant-layout-header">
    <router-link to="/" class="logo" />
    <div class="action-group left">
      <router-link to="/exchange">
        Exchange
      </router-link>
    </div>
    <div class="action-group right">
      <div v-if="isAuth" class="auth">
        <router-link to="/assets/balance">
          My Assets
        </router-link>
        <a-dropdown placement="bottomCenter">
          <a class="ant-dropdown-link">
            {{ ORDERS_MENU.NAME }}
            <i class="ic-arrow-down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item
              v-for="data in ORDERS_MENU.MENU"
              :key="data.url"
              :title="data.name"
              :class="{
                'ant-dropdown-menu-item-selected': path.includes(data.url),
              }"
            >
              <router-link :to="data.url" v-text="data.name" />
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-dropdown placement="bottomCenter">
          <a class="ant-dropdown-link">
            UUUU
            <i class="ic-arrow-down" />
          </a>
          <a-menu slot="overlay" class="dropdown-user">
            <a-menu-item key="information" class="information">
              <router-link to="/account/information" tag="li">
                <div class="email">
                  {{ USER.email }}
                </div>
                <div class="uid" v-text="`UID: ${USER.uid}`" />
              </router-link>
            </a-menu-item>
            <a-menu-item
              v-for="data in USER_MENU.MENU"
              :key="data.url"
              :title="data.name"
              :class="[
                'ink',
                { 'ant-dropdown-menu-item-selected': path.includes(data.url) },
              ]"
            >
              <router-link :to="data.url" v-text="data.name" />
            </a-menu-item>
            <a-menu-item
              key="logout"
              title="Logout"
              class="ink"
              @click="logout"
            >
              Logout
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div v-else class="un-auth">
        <router-link
          v-for="(data, index) in BUTTON"
          :key="index"
          :to="data.url"
          tag="button"
          class="ant-btn ant-btn-primary"
          v-text="data.name"
        />
      </div>
      <a-dropdown placement="bottomRight">
        <a class="ant-dropdown-link">
          {{ $t("name") }}
          <i class="ic-arrow-down" />
        </a>
        <a-menu slot="overlay" @click="setLanguage">
          <a-menu-item
            v-for="(data, index) in messages"
            :key="index"
            :title="data.name"
            :class="{ 'ant-dropdown-menu-item-selected': locale === data.name }"
            v-text="data.name"
          />
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import config from "@/config";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component } from "vue-property-decorator";
import { i18n } from "@/plugins";

@Component
export default class App extends Vue {
  public readonly BUTTON = [
    { name: "Log In", url: "/signin" },
    { name: "Sign Up", url: "/signup" },
  ];

  public readonly ORDERS_MENU = {
    NAME: "Orders",
    MENU: [
      {
        name: "Open Orders",
        url: "/exchange_record/open",
      },
      {
        name: "Order History",
        url: "/exchange_record/history",
      },
      {
        name: "Trade History",
        url: "/exchange_record/transaction",
      },
    ],
  };

  public readonly USER_MENU = {
    MENU: [
      { name: "Account Security", url: "/account/security" },
      { name: "KYC Account Verification", url: "/account/kyc" },
      { name: "Login History", url: "/account/history" },
      { name: "API", url: "/account/api" },
    ],
  };

  get messages() {
    return config.messages;
  }

  get isAuth() {
    return helpers.isAuth();
  }

  get USER() {
    return this.$store.state.user;
  }

  get locale() {
    return this.$t("name");
  }

  get path() {
    return this.$store.state.public.path;
  }

  get getSelectedItemAccount() {
    const { path } = this;
    const account_path = {
      main: "/account",
      path: ["security", "kyc", "history", "api"],
      name: "ORDERS_MENU",
    };

    if (path.includes(account_path.main)) {
      const { main } = account_path;

      for (const row of account_path.path) {
        const check_path = [main, row].join("/");
        const condition = path.includes(check_path);

        if (condition) {
          return [check_path];
        }
      }
    }

    return null;
  }

  public checkSelectedLang(name: string) {
    return this.$t("name") === name;
  }

  public setLanguage(item) {
    const locale = item.key;
    if (this.locale === locale) { return; }
    localStorage.setItem("LANGUAGE_HASH", locale);
    i18n.locale = locale;
    ZSmartModel.emit("change-language");
  }

  public logout() {
    this.$store.dispatch("user/LOGOUT");
  }
}
</script>
