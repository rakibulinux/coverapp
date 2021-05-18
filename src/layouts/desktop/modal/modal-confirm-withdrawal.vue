<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="confirm-withdrawal-modal"
    :footer="null"
    :width="400"
  >
    <a-icon type="warning" class="logo-modal" />
    <div class="title">
      {{ translation("title") }}
    </div>
    <div class="desc">
      {{ translation("desc") }}
    </div>
    <form @submit.prevent="confirm_withdrawal">
      <auth-input
        v-model="confirmation_code"
        name="confirmation_code"
        :placeholder="$t('page.global.placeholder.confirmation_code')"
        :placeholder-need="true"
        maxlength="6"
        type="number"
      >
        <template slot="right-action">
          <button :disabled="cooldown > 0" @click.prevent="resend_code">
            <template v-if="cooldown > 0">Resend({{ cooldown }})</template>
            <template v-else>
              Send code
            </template>
          </button>
        </template>
      </auth-input>

      <auth-button
        type="submit"
        :loading="loading"
        :disabled="confirmation_code.length < 6"
        @click="confirm_withdrawal"
      >
        {{ $t("page.global.action.confirm") }}
      </auth-button>
    </form>
  </a-modal>
</template>

<script lang="ts">
import * as helpers from "@zsmartex/z-helpers";
import { ConfirmationMixin, ModalMixin } from "@/mixins";
import { Mixins, Component } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class ModalConfirmWithdrawal extends Mixins(
  ModalMixin,
  ConfirmationMixin
) {
  withdraw: ZTypes.Withdraw;
  loading = false;
  confirmation_code = "";

  onCreate(withdraw: ZTypes.Withdraw) {
    this.withdraw = withdraw;
  }

  async confirm_withdrawal() {
    this.loading = true;

    await this.TradeController.confirm_withdrawal(
      this.withdraw.tid,
      this.confirmation_code,
      () => {
        this.delete();
      }
    );

    this.loading = false;
  }

  async resend_code() {
    this.loading_resend = true;

    await this.TradeController.generate_withdrawal_code(
      this.withdraw.tid,
      () => {
        this.start_cooldown();
      }
    );

    this.loading_resend = false;
  }

  translation(message, data = {}) {
    return helpers.translation("modal.withdraw." + message, data);
  }
}
</script>
