<template>
  <div class="setting-main information">
    <div class="setting-head">
      {{ $t("usercenter.account_information.title") }}
    </div>
    <div class="setting-body">
      <table class="table">
        <tr
          v-for="(data, index) in account_informations"
          :key="index"
          class="row"
        >
          <td class="name" v-text="data.name" />
          <td class="desc" v-text="data.desc" />
          <td v-if="data.type === 'text'" class="value" v-text="data.value" />
          <td v-else class="action">
            <a @click="onClick(data.action.runner)" v-text="data.action.text" />
          </td>
        </tr>
      </table>
    </div>
    <modal-phone ref="phone" />
  </div>
</template>

<script lang="ts">
import * as helpers from "@zsmartex/z-helpers";
import store from "@/store";
import { Vue, Component } from "vue-property-decorator";
import _modal_phone from "@/layouts/desktop/account/_modal_phone.vue";
import Helpers from "./helpers";

@Component({
  components: {
    "modal-phone": _modal_phone
  },
  mixins: [Helpers]
})
export default class AccountInformation extends Vue {
  get user_state() {
    return store.state.user;
  }

  get account_informations() {
    return [
      {
        name: "UID",
        type: "text",
        desc: ``,
        value: this.user_state.uid
      },
      {
        name: this.translation("account_information.rows.email.name"),
        type: "text",
        desc: this.translation("account_information.rows.email.desc"),
        value: this.user_state.email
      },
      {
        name: "Phone",
        type: this.user_state.phone.validated ? "text" : "action",
        desc: this.translation("account_information.rows.email.desc"),
        value: this.user_state.phone.validated
          ? "+" + this.user_state.phone.number
          : "",
        action: {
          allow: !this.user_state.phone.validated,
          text: "Setting",
          runner: "phone"
        }
      }
    ];
  }

  translation(message: string, data?: {}) {
    return helpers.translation("usercenter." + message, data);
  }
}
</script>
