<template>
  <div class="user-drawer-head user-info">
    <div v-if="isAuth" class="user-info-content"></div>
    <div v-else class="user-info-content" @click="$emit('login-click')">
      <div class="user-info-avatar">
        <img src="@/assets/img/avatar.png" />
      </div>
      <div class="user-info-title">
        Log In

        <div class="user-info-description">
          Welcome to ZSmart
        </div>
      </div>
    </div>

    <div class="user-info-action-group">
      <div class="user-info-action">
        <div class="user-info-action-icon">
          <a-icon type="file-protect" />
        </div>
        <div class="user-info-action-content">Security</div>
      </div>
      <div class="user-info-action">
        <div class="user-info-action-icon"><a-icon type="idcard" /></div>
        <div class="user-info-action-content">KYC</div>
      </div>
      <div class="user-info-action">
        <div class="user-info-action-icon"><a-icon type="solution" /></div>
        <div class="user-info-action-content">History</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@zsmartex/z-helpers";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class UserDrawerHead extends Vue {
  get isAuth(): boolean {
    return helpers.isAuth();
  }
}
</script>
