<template>
  <body :class="{ 'mobile-view': isMobile }">
    <a-layout
      v-if="isReady"
      :class="{
        night: this.$route.path === '/exchange',
        'no-border': this.$route.path === '/exchange'
      }"
    >
      <header-exchange v-if="!isMobile" />

      <router-view />

      <tab-bar v-if="isMobile" />

      <footer-exchange v-if="$route.path !== '/exchange' && !isMobile" />

      <login-panel v-if="!isAuth && isMobile" ref="login-mobile" />

      <suggestion-2fa v-if="isAuth && isMobile" ref="suggestion-2fa" />
    </a-layout>

    <loading-page v-else />
  </body>
</template>

<script lang="ts">
import config from "@/config";
import setTheme from "@/library/setTheme";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component } from "vue-property-decorator";
import colors from "@/colors";

@Component({
  components: {
    "header-exchange": () => import("@/layouts/desktop/_header.vue"),
    "footer-exchange": () => import("@/layouts/desktop/_footer.vue"),
    "tab-bar": () => import("@/layouts/mobile/_tab_bar.vue"),
    "loading-page": () => import("@/layouts/loading-page.vue"),
    "suggestion-2fa": () => import("@/layouts/mobile/suggestion-2fa.vue"),
    "login-panel": () => import("@/views/mobile/screens/auth/login")
  }
})
export default class App extends Vue {
  public $refs!: {
    [key: string]: any;
  };

  get isAuth() {
    return helpers.isAuth();
  }

  get isMobile() {
    return helpers.isMobile();
  }

  get isReady() {
    return this.$store.state.public.ready;
  }

  public beforeCreate() {
    "localStorage" in window;
    if (localStorage.getItem("SYMBOLS_HASH") == null) {
      localStorage.setItem("SYMBOLS_HASH", config.default_market());
    }
    if (localStorage.getItem("LANGUAGE_HASH") == null) {
      localStorage.setItem("LANGUAGE_HASH", "en");
    }
    if (
      localStorage.getItem("exchangeTheme") === null ||
      localStorage.getItem("exchangeTheme") == "light"
    ) {
      localStorage.setItem("exchangeTheme", "night");
    }
  }

  mounted() {
    const isMobileRouter = location.pathname.includes("/m");
    if (this.isMobile && !isMobileRouter) {
      this.$router.push("/m");
    }
    this.setTheme();
    ZSmartModel.on("need-login", (func = null) => {
      this.openPanel("login-mobile", func);
    });
    ZSmartModel.on("need-setup-2fa", () => {
      this.openPanel("suggestion-2fa");
    });
  }

  public openPanel(panel: string, func?: Function) {
    this.$refs[panel].render(func);
  }

  public setTheme() {
    new setTheme().setTheme(colors);
  }
}
</script>

<style lang="less">
//TODO: move this less file to another file vue

@import "~@/assets/css/themes/mobile/index";
</style>
