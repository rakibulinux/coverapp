<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title">Reset Password</h3>
        <form @submit.prevent="reset_password">
          <auth-input
            v-model="password"
            name="password"
            type="password"
            placeholder="Passsord"
            :placeholder-need="true"
            :error="password_error"
          />
          <auth-input
            v-model="confirm_password"
            name="confirm_password"
            type="password"
            placeholder="Confirm passsord"
            :placeholder-need="true"
            :error="confirm_password_error"
          />
          <auth-button
            type="submit"
            :loading="loading"
            :disabled="button_disabled"
          >
            Reset Password
          </auth-button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import ApiClient from "@zsmartex/z-apiclient";
import store from "@/store";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue"),
  },
})
export default class App extends Vue {
  public loading = false;
  public password = "";
  public confirm_password = "";

  get password_error() {
    const { password } = this;
    if (!password.length) { return false; }

    if (!helpers.validPassword(password)) {
      return "Incorrect email address. Please enter again.";
    }
  }

  get confirm_password_error() {
    const { password, confirm_password } = this;
    if (!confirm_password.length) { return false; }

    if (confirm_password !== password) {
      return "Incorrect email address. Please enter again.";
    }
  }

  get button_disabled() {
    const { password, confirm_password } = this;
    const { password_error, confirm_password_error } = this;

    const rule_1 = password.length || confirm_password.length;
    const rule_2 = !password_error && !confirm_password_error;
    let allow = rule_1 && rule_2;
    allow = allow && !this.loading;

    return !allow;
  }

  public async reset_password() {
    const token = store.state.user.reset_password_token;
    const { password, confirm_password } = this;
    this.loading = true;

    try {
      await new ApiClient("auth").post(
        "/identity/users/password/set_password",
        {
          token,
          password,
          confirm_password,
        },
      );
      this.loading = false;

      helpers.runNotice("warning", "Password was changed");
      this.$router.push("/account/security");
    } catch (error) {
      this.loading = false;
      return error;
    }
  }
}
</script>
