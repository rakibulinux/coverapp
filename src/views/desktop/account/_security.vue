<template>
  <div class="setting-main security">
    <div class="setting-head">
      {{ $t("usercenter.account_security.title") }}
    </div>
    <div class="setting-body">
      <table class="table">
        <tr
          v-for="(data, index) in $store.getters['user/getAccountSecurity']"
          :key="index"
          class="row"
        >
          <td class="name" v-html="data.name" />
          <td class="desc" v-html="data.desc" />
          <td class="action">
            <a
              v-if="data.action.allow"
              @click="onClick(data.action.runner)"
              v-html="data.action.text"
            />
          </td>
        </tr>
      </table>
    </div>
    <modal-2fa ref="2fa" />
    <modal-password ref="password" @changeModal="onClick" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import store from "@/store";
import * as helpers from "@zsmartex/z-helpers";
import _modal_2fa from "@/layouts/desktop/account/_modal_2fa.vue";
import _modal_password from "@/layouts/desktop/account/_modal_password.vue";
import Helpers from "./helpers";

@Component({
  components: {
    "modal-2fa": _modal_2fa,
    "modal-password": _modal_password
  },
  mixins: [Helpers]
})
export default class AccountSecurity extends Vue {
  get user_state() {
    return store.state.user;
  }

  get account_security() {
    return [
      {
        status: true,
        name: this.translation("account_security.rows.psw.name"),
        desc: this.translation("account_security.rows.psw.desc"),
        action: {
          allow: true,
          text: this.translation("account_security.rows.psw.action"),
          runner: "password"
        }
      },
      {
        status: this.user_state.otp,
        name: this.translation("account_security.rows.otp.name"),
        desc: this.translation("account_security.rows.otp.desc"),
        action: {
          allow: !this.user_state.otp,
          text: this.translation("account_security.rows.otp.action"),
          runner: "2fa"
        }
      }
    ];
  }

  translation(message: string, data?: {}) {
    return helpers.translation("usercenter." + message, data);
  }
}
</script>
