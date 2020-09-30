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
          <button type="submit" :disabled="button_disabled">
            <span>{{ button_content }}</span>
            <span v-if="sended && wait != 0">({{ wait }})</span>
          </button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import store from "@/store";
import { Vue, Component } from "vue-property-decorator";
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";
import UserController from "@/controllers/user";
import { i18n } from "@/plugins";
import ZSmartModel from "@zsmartex/z-eventbus";

@Component
export default class App extends Vue {
  wait = 0;
  WaitInterval?: NodeJS.Timeout;
  confirming = false;

  get confirmation_token() {
    return this.$route.query["confirmation_token"];
  }

  get button_disabled() {
    let allow = true;
    const { sended, wait } = this;

    allow = !sended && wait === 0;
    return !allow;
  }

  get button_content() {
    return this.confirming ? "Confirming Email" : "Resend Email";
  }

  // TODO: move sended_email from store to router meta data
  get sended() {
    return this.$store.state.user.session.sended_email;
  }

  set sended(value: boolean) {
    this.$store.state.user.session.sended_email = value;
  }

  async mounted() {
    if (this.confirmation_token) {
      const lang = this.$route.query["lang"] as string;
      if (lang) {
        localStorage.setItem("LANGUAGE_HASH", lang);
        i18n.locale = lang;
        ZSmartModel.emit("change-language");
      }

      this.confirming = true;

      await UserController.confirm_email(this.confirmation_token);
      this.confirming = false;
    }
    if (this.sended) this.actionReSend();
  }

  public actionReSend() {
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
  }

  public async reSendEmail() {
    try {
      await new ApiClient("auth").post("identity/users/email/generate_code", {
        email: store.state.user.real_email
      });
      this.actionReSend();
      helpers.runNotice("success", "check email");
    } catch (error) {
      return error;
    }
  }
}
</script>
