<template>
  <div class="setting-main security">
    <div class="setting-head">{{ $t("usercenter.account_security.title") }}</div>
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

<script>
import * as helpers from "@zsmartex/z-helpers";
import _modal_2fa from "@/layouts/desktop/account/_modal_2fa.vue";
import _modal_password from "@/layouts/desktop/account/_modal_password.vue";
import Helpers from "./helpers";

export default {
  components: {
    "modal-2fa": _modal_2fa,
    "modal-password": _modal_password
  },
  mixins: [Helpers],
  data: () => ({
    email: null,
    password: "**********"
  }),
  mounted() {
    const { email } = this.$store.state.user;
    this.email = helpers.emailEncode(email);
  }
};
</script>
