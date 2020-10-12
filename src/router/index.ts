import config from "@/config";
import store from "@/store";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";

Vue.use(Router);

try {
  const favorites = localStorage.getItem("favorites");

  if (favorites.length) JSON.parse(favorites);
} catch (error) {
  localStorage.removeItem("favorites");
}

let first_route = true;

const router = new Router({
  mode: "history",
  base: "/",
  linkExactActiveClass: "ant-menu-item-active",
  linkActiveClass: "",
  routes
});

const PathToTitle = (path: string) => {
  const prefix_key_title = "titlePage";
  const url_split = path.split("/");
  const suffix_key_title =
    url_split.length > 1 && !!url_split[1] ? url_split.join(".") : ".main";

  return prefix_key_title + suffix_key_title;
};

const SetRouterByPath = (path: string) => {
  const page_title = PathToTitle(path);

  store.commit("public/SET_ROUTER", path);
  store.commit("public/SET_TITLE", config[page_title]);
};

const PathHandle = (path: string) => {
  if (path.includes("/exchange/")) {
    const markets: string[] = store.getters["public/getAllMarkets"].map(
      row => row.name
    );
    const market = path.replace("/exchange/", "").split("-");
    if (!markets.includes(market.join("/"))) {
      return router.push("/exchange");
    } else {
      store.commit("public/SYNC_EXCHANGE", { market: market.join("_") });
    }
  }
};

const pre_fetch_list = [
  { commit: "public/MARKETS", key: "markets", ready: false },
  { commit: "public/CURRENCIES", key: "currencies", ready: false },
  { commit: "public/TICKERS", key: "tickers", ready: false },
  { commit: "public/TRADING_FEES", key: "trading_fees", ready: false },
  { commit: "public/GLOBAL_PRICE", key: "global_price", ready: false }
];

router.beforeEach(async (to, from, next) => {
  store.state.public.prev_path = from.fullPath;
  PathHandle(to.path);

  if (!store.state.public.ready && first_route) {
    first_route = false;

    await store.dispatch("user/getLogged");
    while (true) {
      if (pre_fetch_list.filter(({ ready }) => ready === false).length == 0) {
        store.commit("public/PAGE_READY");
        break;
      }

      for (const index in pre_fetch_list.filter(
        ({ ready }) => ready === false
      )) {
        const fetch = pre_fetch_list[index];
        if ((window as any).z_cache[fetch.key].success == false)
          location.reload();
        store.commit(fetch.commit, (window as any).z_cache[fetch.key].data);
        pre_fetch_list[index].ready = true;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  if (
    helpers.authStatus() == "pending" &&
    !to.fullPath.includes("/confirmation/email")
  ) {
    next("/confirmation/email");
  } else if (
    helpers.authStatus() != "pending" &&
    to.fullPath.includes("/confirmation/email")
  ) {
    next("/");
  } else if (
    helpers.isMobile() &&
    !to.matched.some(record => record.meta.mobile)
  ) {
    next("/m");
  } else if (to.matched.some(record => record.meta.guest) && helpers.isAuth()) {
    next("/account/security");
  } else if (
    to.matched.some(record => record.meta.requiresAuth) &&
    !helpers.isAuth()
  ) {
    if (helpers.isMobile()) {
      if (from.path === "/") {
        next("/m");

        setTimeout(() => {
          ZSmartModel.emit("need-login", next);
        }, 500);
      } else {
        ZSmartModel.emit("need-login", next);
      }
    } else {
      next("/signin");
    }
  } else if (
    to.matched.some(record => record.meta.requiresTokenReset) &&
    !to.query["confirmation_token"]
  ) {
    next("/signin");
  } else {
    next();
  }
});

router.afterEach(to => {
  SetRouterByPath(to.path);
});

if (process.env.NODE_ENV === "development") {
  (global as any).store = store;
  (global as any).router = router;
  (global as any).helpers = helpers;
}

export default router;
