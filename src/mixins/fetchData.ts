import store from "@/store";
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";

export default () => {
  store.dispatch("user/getLogged");
  store.dispatch("public/getCurrencies");
  store.dispatch("public/getGlobalPrice");
  store.dispatch("public/getMarkets");
  store.dispatch("public/getSparkLines");
  store.dispatch("public/getTickers");

  if (process.env.NODE_ENV === "development") {
    (global as any).helpers = helpers;
    (global as any).ApiClient = ApiClient;
    (global as any).store = store;
  }
};
