<template>
  <a-layout
    v-if="page_ready"
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
</template>

<script lang="ts">
import config from "@/config";
import setTheme from "@/library/setTheme";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component, Watch } from "vue-property-decorator";
import colors from "@/colors";
import { PublicController, UserController } from "./controllers";

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
    return UserController.state == "active";
  }

  get isMobile() {
    return helpers.isMobile();
  }

  get page_ready() {
    return PublicController.page_ready;
  }

  public beforeCreate() {
    "localStorage" in window;
    if (localStorage.getItem("market") == null) {
      localStorage.setItem("market", config.default_market);
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
    if (this.isMobile) document.body.classList.add("mobile-view");
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

  @Watch("page_ready")
  on_page_ready(page_ready: boolean) {
    document.querySelector("body>.page-loading").remove();
  }
}
</script>

<style lang="less">
//TODO: move this less file to another file vue

@import "~@/assets/css/themes/mobile/index";
</style>
