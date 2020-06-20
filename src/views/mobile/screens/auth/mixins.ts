import * as helpers from "@zsmartex/z-helpers";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button")
  }
})
export default class AuthMixin extends Vue {
  loading!: boolean;
  email!: string;
  password!: string;
  confirm_password!: string;
  refid!: string;
  button_rules!: string[];

  get email_error() {
    const { email } = this;

    if (email.length && !helpers.validEmail(email)) {
      return this.$t("auth.input_error.email");
    }
  }

  get password_error() {
    const { password } = this;

    if (password.length && !helpers.validPassword(password)) {
      return this.$t("auth.input_error.password");
    }
  }

  get confirm_password_error() {
    const { password, confirm_password } = this;

    if (confirm_password.length && confirm_password !== password) {
      return this.$t("auth.input_error.confirm_password");
    }
  }

  get refid_error() {
    const { refid } = this;
    const regex = /^ID\w{10}$/g;

    if (refid.length && regex.test(refid)) {
      return this.$t("auth.input_error.refid");
    }
  }

  get button_disabled() {
    return this.button_rules.map(rule => {
      if (rule === "loading") return this.loading;
      return !(!!(this[rule] as string).length && !this[`${rule}_error`]);
    }).reduce((a, b) => a || b, false);
  }
}
