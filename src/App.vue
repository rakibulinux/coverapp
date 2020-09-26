<template>
  <body :class="{ 'mobile-view': isMobile }">
    <a-layout
      v-if="isReady"
      :class="{
        night: $route.path === '/exchange',
        'no-border': $route.path === '/exchange'
      }"
    >
      <header-exchange v-if="!isMobile" />
      <router-view />
      <auth-login-screen v-if="isMobile" ref="auth-login-screen" />
      <tab-bar v-if="isMobile" />

      <footer-exchange v-if="$route.path !== '/exchange' && !isMobile" />
    </a-layout>
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
    "panel-view": () => import("@/components/mobile/panel-view.vue"),
    "tab-bar": () => import("@/layouts/mobile/_tab_bar.vue"),
    "loading-page": () => import("@/layouts/loading-page.vue"),
    "auth-login-screen": () => import("@/views/mobile/screens/auth/login")
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
    this.setTheme();

    if (this.isMobile) {
      let first_time = true;

      this.$router.afterEach(() => {
        if (!first_time) return;

        first_time = false;

        ZSmartModel.on("need-login", (callback?: Function) => {
          this.$refs["auth-login-screen"].create(callback);
        });

        history.pushState(null, document.title, location.href);
        window.addEventListener("popstate", () => {
          history.pushState(null, document.title, location.href);
        });
      });
    }
  }

  public openPanel(panel: string, callback?: Function) {
    this.$refs[panel].create(callback);
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
