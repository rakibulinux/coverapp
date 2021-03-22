import router from "@/router";
import store from "@/store";
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import Vue from "vue";
import Store, { IStore } from "./store";
import GettersSetters from "./getters_setters";
import { applyMixins } from '../mixins';
import ZSmartModel from "@zsmartex/z-eventbus";
import { runNotice } from "@/mixins";
import { isMobile } from "@zsmartex/z-helpers";

export class UserController {
  store = Store;

  constructor() {
    ZSmartModel.on("user/LOGIN", () => {
      this.keep_session();

      if (this.state == "active") {
        this.get_balance();
      }
    });

    ZSmartModel.on("user/LOGOUT", () => {
      this.auth_error();

      if (helpers.isMobile()) {
        if (router.currentRoute.fullPath != "/m") router.push({ path: "/m" });
      } else {
        if (router.currentRoute.fullPath != "/") router.push({ path: "/" });
      }
  
      runNotice("success", "LOG OUT");
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
    this.auth_loading();

    try {
      const { data } = await new ApiClient("auth").post("identity/sessions", payload);

      if (data.state == "deleted") {
        runNotice("error", "Your account has been deleted");
        return
      }

      if (!isMobile()) {
        this.auth_success(data, "login", data.state == "active" ? url_callback : "/confirmation/email");
      } else {
        this.auth_success(data, "login");
      }

      if (data.state == "active") { 
        runNotice("success", "Login successfuly");
      } else if (data.state == "pending") {
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
    },
    url_callback?: string
  ) {
    this.auth_loading();

    if (!payload.refid) delete payload.refid;
    payload.lang = "en";

    try {
      const { data } = await new ApiClient("auth").post("identity/users", payload);

      this.auth_success(data, "register", url_callback);

      this.session.sended_email = true;
      runNotice("warning", "Check Your Email NOW");

      if (isMobile()) return;

      router.push("/confirmation/email");
    } catch (error) {
      this.auth_error();
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
    this.auth_loading();

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
    if (this.state == "pending") ZSmartModel.emit("user/WAIT_EMAIL");

    if (url_callback) router.push({ path: url_callback });
  }

  private auth_loading() {
    this.state = "loading";
  }

  private auth_error() {
    this.state = null;
    localStorage.removeItem("csrf_token");
  }

  get_activity(topic: "all" | "session" | "password" | "otp", action: string, page = 1, limit = 100) {
    return new ApiClient("auth").get(`resource/users/activity/${topic}`, { action, page, limit });
  }

  async resend_email(email: string, callback?: () => void) {
    try {
      const response = await new ApiClient("auth").post("identity/users/email/generate_code", {
        email: email
      });

      runNotice("success", "check email");
      if (callback) callback();

      return response;
    } catch (error) {
      return error;
    }
  }

  async forgot_password(email: string, captcha_response: string, callback?: () => void) {
    try {
      await new ApiClient("auth").post("/identity/users/password/generate_code", { email, captcha_response });
      runNotice("success", helpers.translation("message.password.forgot"));
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async confirm_email(code: string, callback?: () => void) {
    try {
      const { data } = await new ApiClient("auth").post("identity/users/email/confirm_code", { email: this.email, code });
      this.state = data.state;
      localStorage.setItem("csrf_token", data.csrf_token);
      runNotice("success", "Confirmation email successfuly");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async confirm_reset_password(email: string, code: string, password: string, confirm_password: string, callback?: () => void) {
    try {
      await new ApiClient("auth").post("identity/users/password/confirm_code", { email, code, password, confirm_password });
      runNotice(
        "success",
        helpers.translation("message.password.changed").toString()
      );
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async check_code_reset_password(email: string, code: string, callback?: () => void) {
    try {
      await new ApiClient("auth").post("identity/users/password/check_code", { email, code });
      runNotice("success", "Mời bạn thay mk");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async change_password(old_password: string, new_password: string, confirm_password: string, callback?: () => void) {
    try {
      await new ApiClient("auth").put("resource/users/password", { old_password, new_password, confirm_password });

      runNotice("success", "Password changed successfuly");
      if (callback) callback();
    } catch (error) {
      return error;
    }
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
      runNotice("success", "thanh cong");
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
