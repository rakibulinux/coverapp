<template>
  <div class="user-drawer-head user-info">
    <div v-if="isAuth" class="user-info-content">
      <div class="user-info-avatar">
        <img src="@/assets/img/avatar.png" />
      </div>

      <div class="user-info-title">
        {{ UserController.email }}

        <div class="user-info-description">UID: {{ UserController.uid }}</div>
      </div>
    </div>
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
      <div
        v-for="action in actions"
        :key="action.key"
        class="user-info-action"
        @click="onActionClick(action.key)"
      >
        <div class="user-info-action-icon">
          <a-icon :type="action.icon" />
        </div>
        <div class="user-info-action-content">{{ action.text }}</div>
      </div>
    </div>

    <security-screen ref="security-screen" />
    <kyc-screen ref="kyc-screen" />
  </div>
</template>

<script lang="ts">
import { UserController } from "@/controllers";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "security-screen": () => import("@/views/mobile/screens/security"),
    "kyc-screen": () => import("@/views/mobile/screens/kyc")
  }
})
export default class UserDrawerHead extends Vue {
  $refs!: {
    "security-screen": any;
  };

  actions = [
    {
      key: "security",
      icon: "file-protect",
      text: "Security"
    },
    {
      key: "kyc",
      icon: "idcard",
      text: "KYC"
    },
    {
      key: "history",
      icon: "solution",
      text: "History"
    }
  ];

  get isAuth(): boolean {
    return UserController.state == "active"
  }

  onActionClick(key: string) {
    if (!this.isAuth) {
      this.$emit("login-click");

      return;
    }

    switch (key) {
      case "security":
        this.$refs["security-screen"].create();
        break;
      case "kyc":
        this.$refs["kyc-screen"].create();
        break;
      default:
        break;
    }
  }
}
</script>
