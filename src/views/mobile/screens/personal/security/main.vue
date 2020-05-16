<template>
  <transition name="panel-move">
    <panel-view v-if="isShowing" class="screen-personal-m security">
      <head-bar title="Security" @on-remove="remove()" />
      <div class="body-bar">
        <div class="setting-list">
          <setting-group>
            <setting-row @click="openChangePassword">
              Change Password
            </setting-row>
          </setting-group>
          <setting-group>
            <setting-row
              :info="user.otp ? 'ON' : 'OFF'"
              @click="openGoogleAuthenticator"
            >
              Google Authenticator
            </setting-row>
            <setting-row
              :info="user.phone.validated ? 'ON' : 'OFF'"
              @click="openSmsAuthenticator"
            >
              SMS Authenticator
            </setting-row>
          </setting-group>
        </div>
      </div>
      <change-password ref="change-password" />
      <google-authenticator ref="google-authenticator" />
      <sms-authenticator ref="sms-authenticator" />
    </panel-view>
  </transition>
</template>

<script>
import Helpers from "../helpers";
import _change_password from "./change_password";
import _google_authenticator from "./google_authenticator";
import _sms_authenticator from "./sms_authenticator";

export default {
  components: {
    "change-password": _change_password,
    "google-authenticator": _google_authenticator,
    "sms-authenticator": _sms_authenticator
  },
  mixins: [Helpers],
  data: () => ({

  }),
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {},
  methods: {
    openChangePassword() {
      this.openPanel("change-password");
    },
    openGoogleAuthenticator() {
      if (this.user.otp) return;
      this.openPanel("google-authenticator");
    },
    openSmsAuthenticator() {
      this.openPanel("sms-authenticator");
    },
    openPanel(modal) {
      this.$refs[modal].render();
    }
  }
};
</script>
