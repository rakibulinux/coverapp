import config from "@/config";
import store from "@/store";
import { i18n } from "@/plugins";
import checkConfirm from "./checkConfirm";
import checkMarket from "./checkMarket";

let firstRouter = true;

const urlToTitle = url => {
  const keyTitle = "titlePage";
  const urlSplit = url.split("/");
  let title = "";
  if (!urlSplit[1]) title = ".main";
  else {
    title = urlSplit.join(".");
  }

  return keyTitle + title;
};

export default to => {
  const pageTitle = urlToTitle(to.path);
  store.commit("public/SET_ROUTER", to.path);
  store.commit("public/SET_TITLE", config[pageTitle]);
  if (to.path.includes("/exchange") && !to.path.includes("/exchange_record")) {
    const payload = to;
    checkMarket(payload);
  } else if (to.path === "/confirmation") {
    const payload = to.query;
    checkConfirm(payload);
  }
  if (firstRouter) {
    firstRouter = false;
    i18n.locale = localStorage.getItem("LANGUAGE_HASH");
  }
};
