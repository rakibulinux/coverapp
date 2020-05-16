<template>
  <z-content class="page-personal-m">
    <action-bar class="head-bar" :left-disabled="true">
      <div class="center-action">
        <span class="title">Account</span>
      </div>
    </action-bar>
    <div class="body-bar">
      <div class="setting-list">
        <div v-if="!isAuth" class="info-auth" @click="onClickLogin">
          <i class="ic-person1" />
          <div class="text">
            Login and Register
          </div>
        </div>
        <div v-else class="info-auth">
          <i class="ic-person1" />
          <div class="text">
            {{ email }}
          </div>
        </div>

        <setting-group>
          <setting-row @click="openSecurity()">
            Security
          </setting-row>
        </setting-group>

        <setting-group>
          <setting-row @click="openMyOrders()">
            My Orders
          </setting-row>
          <setting-row @click="openDWHistory()">
            D/W History
          </setting-row>
        </setting-group>

        <setting-group>
          <setting-row :info="locale" @click="openPanel('language')">
            Language
          </setting-row>
        </setting-group>
      </div>
    </div>
    <language-panel ref="language" />
    <security-panel ref="security" />
    <my-orders-panel ref="my-orders" />
    <dw-history-panel ref="d/w-history" />
  </z-content>
</template>

<script>
import * as helpers from "@zsmartex/z-helpers";
import ZSmartModel from "@zsmartex/z-eventbus";
import {
  _language_panel,
  _security_panel,
  _my_orders_panel,
  _dw_history_panel
} from "@/views/mobile/screens/personal";
import { _setting_group, _setting_row } from "@/components/mobile/settings";

export default {
  components: {
    "action-bar": () => import("@/components/mobile/action-bar.vue"),
    "setting-group": _setting_group,
    "setting-row": _setting_row,
    "language-panel": _language_panel,
    "my-orders-panel": _my_orders_panel,
    "dw-history-panel": _dw_history_panel,
    "security-panel": _security_panel
  },
  computed: {
    isAuth: () => helpers.isAuth(),
    email() {
      return "test.xcz@dsagmail.com";
    },
    locale() {
      return this.$t("name");
    }
  },
  methods: {
    openSecurity() {
      if (this.isAuth) {
        this.openPanel("security");
      } else {
        this.onClickLogin(this.openSecurity);
      }
    },
    openMyOrders() {
      if (this.isAuth) {
        this.openPanel("my-orders");
      } else {
        this.onClickLogin(this.openMyOrders);
      }
    },
    openDWHistory() {
      if (this.isAuth) {
        this.openPanel("d/w-history");
      } else {
        this.onClickLogin(this.openDWHistory);
      }
    },
    onClickLogin(func = null) {
      ZSmartModel.emit("need-login", func);
    },
    openPanel(modal) {
      this.$refs[modal].render();
    }
  }
};
</script>
