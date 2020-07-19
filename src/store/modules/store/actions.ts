import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import { ActionTree } from "vuex";

const actions: ActionTree<any, RootState> = {
  ["store/INIT"](store) {
    const { dispatch } = store;

    (global as any).store = store;
    (global as any).helpers = helpers;
    (global as any).ApiClient = ApiClient;

    return Promise.all([
      dispatch("user/getLogged"),
      dispatch("public/getCurrencies"),
      dispatch("public/getGlobalPrice"),
      dispatch("public/getMarkets"),
      dispatch("public/getTradingFees"),
      dispatch("public/getSparkLines"),
      dispatch("public/getTickers"),
    ]);
  },
};

export default actions;
