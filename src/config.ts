import example_img from "@/assets/img/example_banner.jpg";
import getUrl from "@/getUrl";
import en from "@/plugins/locales/en";
import vn from "@/plugins/locales/vn";

const nameEX = "NameEX";

export default {
  nameEX,
  default_market: () => {
    const base_unit = "ETH";
    const quote_unit = "USDT";
    return base_unit + "_" + quote_unit;
  },
  /*
  feature_markets: ["BTC/ZAR", "BCH/BTC", "ETH/BTC", "DASH/BTC", "LTC/BTC"],
  list_bid1: ["BTC", "ZAR", "USD"],
  list_bid2: ["ETH", "USDT"],
  */
  feature_markets: ["ETH/USDT", "ZIPT/ETH", "ETH/USDT", "ZIPT/ETH", "TST/ETH"],
  list_bid1: ["ETH", "BTC", "USDT"],
  list_bid2: ["ZIPT", "TST"],
  default_selected_market: "ETH",
  topMarket: "BTC",
  messages: {
    en: en,
    vn: vn
  },
  banners: [
    [
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" }
    ],
    [
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" }
    ],
    [
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" }
    ],
    [
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" },
      { img: example_img, link: "/#" }
    ]
  ],
  api: {
    url: "/api/v2/",
    ws: {
      public: getUrl(true) + "/api/v2/websocket/public",
      private:
        getUrl(true) +
        "/api/v2/websocket/private?stream=order&stream=trade&stream=balance"
    }
  },
  recaptcha: {
    sitekey: "6LcrA5wUAAAAABY8KW-beaUOjShGC_U2va3kJEJt"
  },
  timeZone: "UTC",
  SESSION_KEY: "ALLOW-ALL", // For use on exchange
  /** 404 **/
  "titlePage.404": `404`,
  /**  public **/
  "titlePage.main": `Bitcoin Exchange | Cryptocurrency Exchange | ${nameEX}`,
  "titlePage.exchange": `Bitcoin Exchange | Cryptocurrency Exchange | ${nameEX}`,
  /**  unauth **/
  "titlePage.signin": `Log In - ${nameEX}`,
  "titlePage.signup": `Sign Up - ${nameEX}`,
  "titlePage.forgotpassword": `Forgot Login Password - ${nameEX}`,
  "titlePage.resetpassword": `Reset Login Password - ${nameEX}`,
  "titlePage.confirmation.email": `Email Verification - ${nameEX}`,
  /**  auth **/
  "titlePage.assets.balance": `My Assets - ${nameEX}`,
  "titlePage.exchange_record.open": `Open Orders - ${nameEX}`,
  "titlePage.exchange_record.history": `Order History - ${nameEX}`,
  "titlePage.exchange_record.transaction": `Trade History - ${nameEX}`,
  "titlePage.account.information": `Account Information - ${nameEX}`,
  "titlePage.account.security": `Account Security - ${nameEX}`,
  "titlePage.account.kyc": `Account KYC - ${nameEX}`,
  "titlePage.account.history": `Login History - ${nameEX}`,
  "titlePage.account.api": `Account Api Keys - ${nameEX}`
};
