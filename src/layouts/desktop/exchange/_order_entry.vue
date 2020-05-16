<template>
  <a-card
    :bordered="false"
    :tab-list="tabList"
    :active-tab-key="selected"
    class="order-entry-group"
    @tabChange="onTabChange"
  >
    <entry side="buy" />
    <entry side="sell" />
    <modal-exchange v-if="!$store.getters['user/isLoggedIn']" />
  </a-card>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import _entry from "./entry/_entry.vue";
import _modal from "@/components/desktop/exchange/_modal.vue";

export default {
  name: "",
  components: {
    entry: _entry,
    "modal-exchange": _modal
  },
  data: () => ({
    tabList: [
      {
        key: "limit",
        tab: "Limit Order"
      }
    ],
    selected: "limit"
  }),
  methods: {
    onTabChange(type) {
      this.selected = type;
    },
    translation: (message, data = {}) =>
      helpers.translation("exchange." + message, data)
  }
};
</script>
