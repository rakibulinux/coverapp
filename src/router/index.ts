import config from "@/config";
import store from "@/store";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import Vue from "vue";
import Router, { Route } from "vue-router";
import routes from "./routes";

Vue.use(Router);

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
  const suffix_key_title = url_split.length > 1 && !!url_split[1] ? url_split.join(".") : ".main";

  return prefix_key_title + suffix_key_title;
}

const SetRouterByPath = (path: string, query: Route["query"]) => {
  const page_title = PathToTitle(path);

  store.commit("public/SET_ROUTER", path);
  store.commit("public/SET_TITLE", config[page_title]);

  if (path.includes("/exchange/")) {
    const markets: string[] = store.getters["public/getAllMarkets"].map(row => row.name);
    const market = path.replace("/exchange/", "").split("-");
    if (!markets.includes(market.join("/"))) return router.push("/exchange");

    store.commit("public/SYNC_EXCHANGE", { market: market.join("_") });
    router.push("/exchange");
  } else if (path === "/confirmation") {
    switch (Object.keys(query)[0]) {
      case "confirmation_email": {
        const token = query.confirmation_email;
        store.dispatch("user/CONFIRM_EMAIL", token);
        break;
      } case "confirmation_reset": {
        const token = query.confirmation_reset;
        store.dispatch("user/CHECK_RESET_TOKEN", token);
        break;
      } default: {
        router.push("/signin");
      }
    }
  }
}

router.beforeEach(async (to, from, next) => {
  store.state.public.prev_path = from.fullPath;

  if (!store.state.public.ready && first_route) {
    first_route = false;

    await store.dispatch("store/INIT");
  }

  SetRouterByPath(to.path, to.query);

  if (to.matched.some(record => record.meta.guest) && helpers.authStatus() === "active") {
    next("/account/security");
  } else if (to.matched.some(record => record.meta.requiresAuth) && !helpers.isAuth()) {
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
  } else if (to.matched.some(record => record.meta.onlyWait)) {
    next("/signin");
  } else if (to.matched.some(record => record.meta.requiresTokenReset) && !store.state.user.reset_password_token) {
    next("/signin");
  } else {
    next();
  }
});

export default router;
