<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="totp-modal"
    :footer="null"
    :width="400"
    @cancel="onMaskClick"
  >
    <div>
      <img src="@/assets/img/Google_Authenticator.png" class="logo-modal" />
      <div class="title">
        OTP Code
      </div>
      <div class="desc">
        Enter the authentication code from the app below.
      </div>
      <form @submit.prevent="submit">
        <auth-input
          v-model="totp_code"
          name="totp_code"
          placeholder="2FA Code"
          :placeholder-need="true"
          maxlength="6"
          type="number"
        />
        <auth-button type="submit" :disabled="totp_code.length < 6">
          <a-icon v-if="loading" type="loading" style="font-size: 24px" spin />
          {{ $t("auth.confirm") }}
        </auth-button>
      </form>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class App extends Vue {
  @Prop() private readonly payload!: any;
  @Prop() private readonly loading!: boolean;

  public modal_enabled = false;
  private totp_code = "";

  public create() {
    this.modal_enabled = true;
  }

  public delete() {
    this.modal_enabled = false;
  }

  private submit() {
    this.$emit("submit", this.totp_code);
  }

  private onMaskClick() {
    this.$emit("close");
  }

  @Watch("totp_code")
  private onTotpChanged(totp_code: string) {
    if (totp_code.length === 6) {
      this.submit();
    }
  }
}
</script>
