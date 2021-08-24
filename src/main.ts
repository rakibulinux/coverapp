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
import { PublicController, TradeController, WebSocketController, UserController } from "@/controllers";
import Fragment from "@grainrigi/vue-fragment";
import Wave from "./library/wave";
import * as helpers from "@/mixins/helpers";
import moment from "moment";

Vue.use(Fragment.Plugin)
Vue.use(Vue2TouchEvents);
Vue.use(vClickOutside);
Vue.use(Wave);

Vue.config.productionTip = false;
Vue.config.performance = true;
initProgress(router);

Vue.prototype.PublicController = PublicController;
Vue.prototype.TradeController = TradeController;
Vue.prototype.UserController = UserController;
Vue.prototype.WebSocketController = WebSocketController;
Vue.prototype.helpers = helpers;

new Vue({
  store,
  i18n,
  router,
  render: (h) => h(App),
}).$mount("#app");

global.moment = moment;