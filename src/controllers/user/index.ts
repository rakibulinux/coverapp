import router from "@/router";
import store from "@/store";
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import Vue from "vue";
import Store, { IStore } from "./store";
import GettersSetters from "./getters_setters";
import { applyMixins } from '../mixins';
import ZSmartModel from "@zsmartex/z-eventbus";

export class UserController {
  store = Store;

  constructor() {
    ZSmartModel.on("user/LOGIN", () => {
      this.get_balance();
      this.keep_session();
    });

    ZSmartModel.on("user/LOGOUT", () => {
      this.auth_error();

      if (helpers.isMobile()) {
        router.push({ path: "/m" });
      } else {
        router.push({ path: "/" });
      }
  
      helpers.runNotice("success", "LOG OUT");
    })
  }

  get_session() {
    return new ApiClient("auth").get("resource/users/me");
  }

  keep_session() {
    setTimeout(async () => {
      try {
        if (this.state != "active") return;
        await this.get_session();

        this.keep_session();
      } catch (error) {
        return error;
      }
    }, 300000);
  }

  async login(payload: {
      email: string;
      password: string;
      otp_code?: string;
      captcha_response?: string;
    },
    url_callback?: string
  ) {
    this.state = "loading";

    try {
      const { data } = await new ApiClient("auth").post("identity/sessions", payload);

      this.auth_success(data, "login", data.state == "active" && router.currentRoute.fullPath != url_callback ? url_callback : null);
      if (data.state == "active") { 
        helpers.runNotice("success", "Login successfuly");
      } else if (data.state == "pending") {
        ZSmartModel.emit("user/WAIT_EMAIL");
        this.session.sended_email = false;
      }
    } catch (error) {
      this.auth_error();
      return error;
    }
  }

  async register(payload: {
      email: string;
      password: string;
      refid?: string;
      captcha_response?: string;
      lang?: string;
    }
  ) {
    if (!payload.refid) delete payload.refid;
    payload.lang = "en";

    try {
      const { data } = await new ApiClient("auth").post("identity/users", payload);

      this.auth_success(data, "register");

      ZSmartModel.emit("user/WAIT_EMAIL");
      this.session.sended_email = true;
      helpers.runNotice("warning", "Check Your Email NOW");

    } catch (error) {
      return error;
    }
  }

  async logout() {
    try {
      await new ApiClient("auth").delete("identity/sessions");
      ZSmartModel.emit("user/LOGOUT");
    } catch (error) {
      return error;
    }
  }

  async get_logged() {
    this.state = "loading";

    try {
      const { data } = await this.get_session();

      this.auth_success(data, "check");
    } catch (error) {
      this.auth_error();
      return error;
    }
  }

  private auth_success(payload, type: "check" | "login" | "register", url_callback?: string) {
    this.state = payload.state;
    this.email = payload.email;
    this.uid = payload.uid;
    this.role = payload.role;
    this.level = payload.level;
    this.labels = payload.labels;
    this.otp = payload.otp;

    if (payload.phones.length) {
      const phone = payload.phone[payload.phone.length];

      this.phone.number = phone.number;
      this.phone.country = phone.country;
      this.phone.validated_at = phone.validated_at;
    }

    this.need2fa = false;

    if (payload.csrf_token) localStorage.setItem("csrf_token", payload.csrf_token);

    ZSmartModel.emit("user/LOGIN");

    if (url_callback) router.push({ path: url_callback });
  }

  private auth_error() {
    this.state = null;
    localStorage.removeItem("csrf_token");
  }

  get_activity(topic: "all" | "session" | "password" | "otp", action: string, page = 1, limit = 100) {
    return new ApiClient("auth").get(`resource/users/activity/${topic}`, { action, page, limit });
  }

  async confirm_email(token) {
    try {
      await new ApiClient("auth").post("identity/users/email/confirm_code", { token });
      store.state.user.state = "active";
      router.push("/account/security");
      helpers.runNotice("success", "Confirmation email successfuly");
    } catch (error) {
      helpers.runNotice("error", "Wrong confirmation token");
      return error;
    }
  }

  async confirm_reset_password(token: string, password: string, confirm_password: string) {
    try {
      await new ApiClient("auth").post("identity/users/password/confirm_code", { reset_password_token: token, password, confirm_password });
      helpers.runNotice(
        "success",
        helpers.translation("message.password.changed").toString()
      );
      router.push("/signin");
    } catch (error) {
      return error;
    }
  }

  check_code_reset_password(token: string) {
    return new ApiClient("auth").post("identity/users/password/check_code", { token });
  }

  async get_balance() {
    try {
      const { data } = await new ApiClient("trade").get("account/balances");
      this.balances = data;
    } catch (error) {
      return error;
    }
  }

  add_update_balance(balance: ZTypes.Balance) {
    const index = this.balances.findIndex(row => {
      return row.currency === balance.currency
    });
    if (index >= 0) {
      Vue.set(this.balances, index, balance);
    } else {
      Vue.set(this.balances, this.balances.length, balance);
    }
  }

  async get_labels() {
    try {
      const { data } = await new ApiClient("auth").get("resource/labels");

      store.state.user.labels = data;
    } catch (error) {
      return error;
    }
  }

  async get_qrcode(): Promise<{ barcode: string; url: string } | null> {
    try {
      const { data } = await new ApiClient("auth").post("resource/otp/generate_qrcode");
      return data.data;
    } catch (error) {
      return null;
    }
  }

  async enable_2fa(password: string, otp_code: string, on_success?: () => void) {
    try {
      await new ApiClient("auth").post("resource/otp/enable", {
        password,
        code: otp_code
      });
      store.commit("user/ENABLE_OTP");
      this.otp = true;
      helpers.runNotice("success", "thanh cong");
      on_success();
    } catch (error) {
      return;
    }
  }
}

export interface UserController extends GettersSetters {
  store: IStore;
}

applyMixins(UserController, [GettersSetters]);
const class_mounted = new UserController();

export default class_mounted;
