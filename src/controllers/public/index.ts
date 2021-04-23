import ApiClient from "@zsmartex/z-apiclient";
import { applyMixins } from "../mixins";
import Store, { IStore } from "./store";
import Helpers from "./helpers";
import GettersSetters from './getters_setters';
import config from "@/config";

export class PublicController {
  store = Store;
  helpers = new Helpers(this.store);

  set_title(title: string) {
    document.title = title;
  }

  async fetch_currencies() {
    try {
      const { data } = await new ApiClient("trade").get("public/currencies");

      this.currencies = data;
    } catch (error) {
      return error;
    }
  }

  async fetch_markets() {
    try {
      const { data } = await new ApiClient("trade").get("public/markets");

      this.markets = data;
    } catch (error) {
      return error;
    }
  }

  async fetch_tickers() {
    try {
      const { data } = await new ApiClient("trade").get("public/markets/tickers");
      const tickers = {};

      for (const id in data) {
        const ticker = data[id].ticker;

        tickers[id] = ticker;
      }

      this.tickers = tickers;

    } catch (error) {
      return error;
    }
  }

  async fetch_trading_fees() {
    try {
      const { data } = await new ApiClient("trade").get("public/trading_fees");

      this.trading_fees = data;
    } catch (error) {
      return error;
    }
  }

  async fetch_global_price() {
    try {
      const { data } = await new ApiClient(config.finex ? "finex" : "trade").get("public/global_price");

      this.global_price = data;
    } catch (error) {
      return error;
    }
  }

  async fetch_banners() {
    try {
      const { data } = await new ApiClient("applogic").get("public/banners");

      const banners: ZTypes.Banner[] = data;
      const get_image_preview = async (uuid: string) => {
        try {
          const { data } = await new ApiClient("applogic").get(`public/banners/preview/${uuid}`, null, { responseType: "arraybuffer" });
  
          return ["data:image/png;base64", Buffer.from(data, "binary").toString("base64")].join(",");
        } catch (error) {
          return null;
        }
      }
  
      await Promise.all(banners.map(async banner => {
        const img_base64 = await get_image_preview(banner.uuid);
  
        banner.image = img_base64;
        banner
      }));

      this.banners = banners;
    } catch (error) {
      return error;
    }
  }

  async fetch_broadcasts() {
    try {
      const { data } = await new ApiClient("applogic").get("public/broadcasts");

      this.broadcasts = data;
    } catch (error) {
      return error;
    }
  }
}

export interface PublicController extends GettersSetters {
  store: IStore;
}

applyMixins(PublicController, [GettersSetters]);

const class_mounted = new PublicController();

export default class_mounted;
