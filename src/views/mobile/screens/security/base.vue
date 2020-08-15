<template>
  <panel-view class="security-screen">
    <head-bar title="Security" @back="destroy" />

    <div class="security-screen-content">
      <setting-row
        value="Change"
        @click="open_screen('password')"
        style="margin-bottom: 8px"
        ripple
      >
        Login Password
      </setting-row>

      <setting-row value="Disabled" @click="open_screen('otp')" ripple>
        Google Verification
      </setting-row>
      <setting-row
        value="Disabled"
        @click="open_screen('phone')"
        style="margin-bottom: 8px"
        ripple
      >
        Phone
      </setting-row>

      <setting-row :value="user_info.email" :clickable="false">
        Email
      </setting-row>
      <setting-row :value="user_info.uid" :clickable="false">
        UID
      </setting-row>
    </div>

    <password-screen ref="password-screen" />
    <otp-screen ref="otp-screen" />
    <phone-screen ref="phone-screen" />
  </panel-view>
</template>

<script lang="ts">
import store from "@/store";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "password-screen": () => import("./password.vue"),
    "otp-screen": () => import("./otp.vue"),
    "phone-screen": () => import("./phone"),
    "setting-row": () => import("@/components/mobile/setting-row")
  }
})
export default class SecurityScreen extends Mixins(ScreenMixin) {
  $refs!: {
    [key: string]: any;
  };

  get user_info() {
    return store.state.user;
  }

  open_screen(screen: string) {
    setTimeout(() => {
      this.$refs[`${screen}-screen`].create();
    }, 150);
  }
}
</script>
