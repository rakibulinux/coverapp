import router from "@/router";
import store from "@/store";
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import Vue from "vue";

export class UserController {
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
      store.state.user.balance = data;
    } catch (error) {
      return error;
    }
  }

  add_update_balance(balance: ZTypes.Balance) {
    const index = store.state.user.balance.findIndex(row => {
      return row.currency === balance.currency
    });
    if (index >= 0) {
      Vue.set(store.state.user.balance, index, balance);
    } else {
      store.state.user.balance.push(balance);
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
}

const class_mounted = new UserController();

export default class_mounted;
