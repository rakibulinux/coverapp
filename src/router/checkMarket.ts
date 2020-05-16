import store from "@/store";

const waitCheckedAll = marketArray => {
  if (store.getters["public/getReady"]) {
    const markets = store.getters["public/getAllMarkets"].map(row => row.name);
    if (markets.includes(marketArray.join("/"))) {
      const market = marketArray.join("_");
      store.commit("public/SYNC_EXCHANGE", market);
    }
  } else {
    setTimeout(() => {
      waitCheckedAll(marketArray);
    }, 10);
  }
};

export default payload => {
  const urlSplit = payload.fullPath.split("/");
  if (urlSplit[2]) {
    const marketArray = urlSplit[2].split("-");
    waitCheckedAll(marketArray);
  }
};
