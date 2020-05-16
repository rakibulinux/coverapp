<template>
  <div class="setting-main information">
    <div class="setting-head">{{ $t("usercenter.account_information.title") }}</div>
    <div class="setting-body">
      <table class="table">
        <tr
          v-for="(data, index) in $store.getters['user/getAccountInformation']"
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

<script>
import _modal_phone from "@/layouts/desktop/account/_modal_phone.vue";
import Helpers from "./helpers";

export default {
  components: {
    "modal-phone": _modal_phone
  },
  mixins: [Helpers]
};
</script>
