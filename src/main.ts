import App from "@/App.vue";
import "@/assets/css/default.scss";
import { i18n, initProgress } from "@/plugins";
import router from "@/router";
import store from "@/store";
import * as vClickOutside from "v-click-outside-x";
import Vue from "vue";
import Vue2TouchEvents from "vue2-touch-events";
import "./registerServiceWorker";
import(/* webpackPreload: true */ "@/assets/css/loading.scss");

Vue.use(Vue2TouchEvents);
Vue.use(vClickOutside);

Vue.config.productionTip = false;
Vue.config.performance = true;
initProgress(router);

new Vue({
  store,
  i18n,
  router,
  render: (h) => h(App),
}).$mount("#body-content");
