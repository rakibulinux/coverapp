import config from "@/config";
import store from "@/store";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";
import { PublicController, TradeController, UserController } from "@/controllers";

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

  PublicController.set_title(config[page_title]);
};

const PathHandle = (path: string) => {
  if (document.location.pathname[document.location.pathname.length -1] == "/" && document.location.pathname.length > 1) {
    document.location.pathname = document.location.pathname.slice(0, document.location.pathname.length - 1);
  }

  if (path.includes("/exchange/")) {
    const markets: string[] = PublicController.markets.map(
      row => row.name
    );
    const market = path.replace("/exchange/", "").split("-");
    if (!markets.includes(market.join("/"))) {
      return router.push("/exchange");
    } else {
      TradeController.open_exchange(market.join("").toLowerCase());
    }
  }
};

router.beforeEach(async (to, from, next) => {
  PathHandle(to.path);

  if (!PublicController.page_ready && first_route) {
    first_route = false;

    await Promise.all([
      UserController.get_logged(),
      PublicController.fetch_currencies(),
      PublicController.fetch_markets(),
      PublicController.fetch_tickers(),
      PublicController.fetch_trading_fees(),
      PublicController.fetch_global_price(),
      PublicController.fetch_banners(),
      PublicController.fetch_broadcasts()
    ]);
    while (true) {
      if (
        PublicController.currencies &&
        PublicController.markets &&
        PublicController.tickers &&
        PublicController.trading_fees &&
        PublicController.global_price &&
        PublicController.banners &&
        PublicController.broadcasts
      ) {
        PublicController.page_ready = true;
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  if (
    UserController.state == "pending" &&
    !to.fullPath.includes("/confirmation/email")
  ) {
    next("/confirmation/email");
  } else if (
    UserController.state != "pending" &&
    to.fullPath.includes("/confirmation/email")
  ) {
    next("/");
  } else if (
    helpers.isMobile() &&
    !to.matched.some(record => record.meta.mobile)
  ) {
    next("/m");
  } else if (to.matched.some(record => record.meta.guest) && UserController.state == "active") {
    next("/account/security");
  } else if (
    to.matched.some(record => record.meta.requiresAuth) &&
    !(UserController.state == "active")
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
