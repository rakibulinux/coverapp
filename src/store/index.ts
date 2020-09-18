import ZSmartStore from "@zsmartex/z-store";
import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
import plugins from "./plugins";

(ZSmartStore as any).modules = Object.assign((ZSmartStore as any).modules, modules);
(ZSmartStore as any).plugins = [...(ZSmartStore as any).plugins, ...plugins]

Vue.use(Vuex);

export default new Vuex.Store<RootState>(ZSmartStore);
