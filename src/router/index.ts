import store from "@/store";
import ZSmartModel from "@zsmartex/z-eventbus";
import * as helpers from "@zsmartex/z-helpers";
import Vue from "vue";
import Router from "vue-router";
import checkFirst from "./checkFirst";
import routes from "./routes";
import waitCheckedLogged from "./waitCheckedLogged";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: "/",
  linkExactActiveClass: "ant-menu-item-active",
  linkActiveClass: "",
  routes
});

router.beforeEach((to, from, next) => {
  waitCheckedLogged(async () => {
    await checkFirst(to);

    if (to.matched.some(record => record.meta.guest)) {
      if (helpers.authStatus() != "active") return next();
      return next("/account/security");
    } else if (to.matched.some(record => record.meta.requiresAuth)) {
      if (helpers.isAuth()) return next();
      if (helpers.isMobile()) {
        if (!store.state.public.ready) {
          return next("/m");
        } else {
          ZSmartModel.emit("need-login", next);
        }
      } else {
        return next("/signin");
      }
    } else if (to.matched.some(record => record.meta.onlyWait)) {
      if (helpers.authStatus() === "pending") return next();
      return next("/signin");
    } else if (to.matched.some(record => record.meta.requiresTokenReset)) {
      if (store.state.user.reset_password_token) return next();
      return next("/signin");
    } else {
      return next();
    }
  });
});

export default router;
