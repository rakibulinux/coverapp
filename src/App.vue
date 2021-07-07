<template>
  <a-layout
    v-if="page_ready"
    :class="{
      night: $route.path.includes('/exchange'),
      'no-border': $route.path.includes('/exchange')
    }"
  >
    <header-exchange v-if="!isMobile" />
    <router-view />
    <auth-login-screen v-if="isMobile" ref="auth-login-screen" />
    <auth-confirm-email-screen
      v-if="isMobile"
      ref="auth-confirm-email-screen"
    />
    <tab-bar v-if="isMobile" />

    <footer-exchange v-if="!($route.name == 'ExchangePage' && exchange_layout == 'pro') && !isMobile" />
  </a-layout>
</template>

<script lang="ts">
import config from "@/config";
import setTheme from "@/library/setTheme";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component, Watch } from "vue-property-decorator";
import colors from "@/colors";
import { PublicController } from "./controllers";
import { wait_and_callback } from "@/mixins";

@Component({
  components: {
    "header-exchange": () => import("@/layouts/desktop/_header.vue"),
    "footer-exchange": () => import("@/layouts/desktop/_footer.vue"),
    "panel-view": () => import("@/components/mobile/panel-view.vue"),
    "tab-bar": () => import("@/layouts/mobile/_tab_bar.vue"),
    "loading-page": () => import("@/layouts/loading-page.vue"),
    "auth-login-screen": () => import("@/views/mobile/screens/auth/login"),
    "auth-confirm-email-screen": () => import("@/views/mobile/screens/auth/confirm_email")
  }
})
export default class App extends Vue {
  public $refs!: {
    [key: string]: any;
  };

  get isMobile() {
    return helpers.isMobile();
  }

  get page_ready() {
    return PublicController.page_ready;
  }

  get exchange_layout() {
    return this.TradeController.exchange_layout;
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
      localStorage.getItem("exchangeTheme") == null ||
      localStorage.getItem("exchangeTheme") == "light"
    ) {
      localStorage.setItem("exchangeTheme", "night");
    }
  }

  mounted() {
    (window as any).coverapp_version = "1.0.1-beta";
    (window as any).helpers = helpers;
    (window as any).ZSmartModel = ZSmartModel;
    (window as any).PublicController = this.PublicController;
    (window as any).TradeController = this.TradeController;
    (window as any).UserController = this.UserController;

    this.setTheme();

    if (this.isMobile) {
      let first_time = true;

      document.body.classList.add("mobile-view");
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

      ZSmartModel.on("user/WAIT_EMAIL", () => {
        wait_and_callback(
          () => this.page_ready && this.$refs["auth-confirm-email-screen"],
          () => {
            this.$refs["auth-confirm-email-screen"].create();
          }
        );
      });
    }
  }

  openPanel(panel: string, callback?: Function) {
    this.$refs[panel].create(callback);
  }

  setTheme() {
    new setTheme().setTheme(colors);
  }

  @Watch("page_ready")
  on_page_ready(page_ready: boolean) {
    if (page_ready) document.querySelector("body>.page-loading").remove();
  }
}
</script>

<style lang="less">
//TODO: move this less file to another file vue

@import "~@/assets/css/themes/mobile/index";
</style>
