<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <form class="confirm-email" @submit.prevent="reSendEmail">
          <h3 class="title">
            Email Verification
          </h3>
          <div class="desc">
            We have sent an activation email to {{ $store.state.user.email }}.
            Please follow click the link inside to complete your activation. If
            you have not received the email. Please Resend Email
          </div>
          <div class="icon-email">
            <img src="@/assets/img/email_icon.png" />
          </div>
          <div class="not-receive-note">
            <h3>If you haven't received the email for a long time, please：</h3>
            <ul>
              <li>• Make sure the email address you provided is correct.</li>
              <li>• Check your Spam or Junk mail folders.</li>
              <li>
                • Add NameEX to your email address whitelist.
                <a href="#" target="_blank">Learn more</a>
              </li>
              <li>• Make sure your email is functioning normally.</li>
            </ul>
          </div>
          <button type="submit" :disabled="buttonDisabled">
            <span>Resend Email</span>
            <span v-if="sended && wait != 0">({{ wait }})</span>
          </button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script>
import Helpers from "./helpers";

export default {
  mixins: [Helpers],
  data: () => ({
    wait: 0
  }),
  computed: {
    buttonDisabled() {
      let allow = true;
      const { send, wait } = this;

      allow = !send && wait === 0;
      return !allow;
    },
    sended: {
      get() {
        return this.$store.state.user.session.sended_email;
      },
      set(val) {
        this.$store.state.user.session.sended_email = val;
      }
    }
  },
  mounted() {
    if (this.sended) this.actionReSend();
  },
  methods: {
    actionReSend() {
      this.sended = true;
      this.wait = 60;
      setTimeout(() => {
        clearInterval(this.WaitInterval);
        this.sended = false;
        this.wait = 0;
      }, 60000);
      this.WaitInterval = setInterval(() => {
        this.wait--;
      }, 1000);
    },
    async reSendEmail() {
      const { email } = this.$store.state.user;
      const lang = "en";

      await new ApiClient("auth")
        .post("identity/users/email/generate_code", {
          email
        })
        .then(() => this.actionReSend())
        .catch(error => error);
    }
  }
};
</script>
