import * as helpers from "@zsmartex/z-helpers";
import VueRecaptcha from "vue-recaptcha";

export default {
  computed: {
    validEmail() {
      const { email } = this;

      return helpers.validEmail(email);
    },
    validPassword() {
      const { password } = this;

      return helpers.validPassword(password);
    },
    validConfirmPassword() {
      const { password, confirm_password } = this;

      return password === confirm_password;
    }
  },
  methods: {
    onVerifyRecaptcha(value) {
      this.captcha_response = value;
    },
    onExpiredRecaptcha() {
      this.captcha_response = "";
    },
    validRefid() {
      const { refid } = this;
      const regex = /^ID\w{10}$/g;
      if (refid) return !regex.test(refid);
      return false;
    },
    translation: (message, data = {}) =>
      helpers.translation("auth.input_error." + message, data)
  },
  components: {
    "vue-recaptcha": VueRecaptcha
  }
};
