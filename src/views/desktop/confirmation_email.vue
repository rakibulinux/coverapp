<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <form
          class="confirm-email"
          @submit.prevent="confirm_email(confirmation_code)"
        >
          <h3 class="title">
            Email Verification
          </h3>
          <div class="desc">
            We have sent an activation email to {{ UserController.email }}.
            Please follow click the link inside to complete your activation. If
            you have not received the email. Please Resend Email
          </div>

          <auth-input
            v-model="confirmation_code"
            name="confirmation_code"
            placeholder="E-mail verification code"
            :placeholder-need="true"
            style="margin-top: 20px; margin-bottom: 8px;"
            maxlength="6"
          >
            <template slot="right-action">
              <button :disabled="cooldown > 0" @click.prevent="resend_email">
                <span v-if="this.loading_resend">
                  Sending...
                </span>
                <span v-else>{{ this.cooldown ? "Resend" : "Send Code" }}</span>
                <span v-if="cooldown">({{ cooldown }})</span>
              </button>
            </template>
          </auth-input>
          <auth-button
            type="submit"
            :loading="loading"
            :disabled="confirmation_code.length < 6"
          >
            Submit
          </auth-button>

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
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { UserController } from "@/controllers";
import { ConfirmationMixin } from "@/mixins";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class ConfirmationEmail extends Mixins(ConfirmationMixin) {
  get sended() {
    return UserController.session.sended_email;
  }

  set sended(value: boolean) {
    UserController.session.sended_email = value;
  }

  async resend_email() {
    this.loading_resend = true;

    await UserController.resend_email(
      UserController.email,
      this.start_cooldown
    );

    this.loading_resend = false;
  }

  async confirm_email() {
    this.loading = true;

    await UserController.confirm_email(this.confirmation_code, () => {
      this.$router.push("/account/security");
    });

    this.loading = false;
  }
}
</script>
