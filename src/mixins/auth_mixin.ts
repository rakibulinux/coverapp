import * as helpers from "@zsmartex/z-helpers";
import { Component, Vue } from "vue-property-decorator";

@Component
export class AuthMixin extends Vue {
  otp!: string;
  loading!: boolean;

  // default auth
  email!: string;
  password!: string;
  confirm_password!: string;
  refid!: string;

  // change password
  old_password!: string;
  new_password!: string;

  button_rules: string[] = [];

  get email_error() {
    const { email } = this;

    if (email.length && !helpers.validEmail(email)) {
      return this.$t("auth.input_error.email");
    }
  }

  get password_error() {
    return this.valid_password(this.password);
  }

  get confirm_password_error() {
    const { password, new_password, confirm_password } = this;

    if (confirm_password.length && confirm_password !== (typeof password === "string" ? password : new_password)) {
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

  get old_password_error() {
    return this.valid_password(this.old_password);
  }

  get new_password_error() {
    return this.valid_password(this.new_password);;
  }

  get otp_error() {
    const { otp } = this;

    if (otp.length && otp.length !== 6) {
      return this.$t("auth.input_error.otp");
    }
  }

  get button_disabled() {
    return this.button_rules.map(rule => {
      if (rule === "loading") return this.loading;
      if (rule === "otp") return this.otp.length === 6;
      return !(!!(this[rule] as string).length && !this[`${rule}_error`]);
    }).reduce((a, b) => a || b, false);
  }

  valid_password(password: string) {
    if (password.length && !helpers.validPassword(password)) {
      return this.$t("auth.input_error.password");
    }
  }
}
