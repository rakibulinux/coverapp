<template>
  <panel-view class="security-phone-screen">
    <head-bar title="Bind Phone Number" @back="destroy" />
    <div class="security-phone-screen-content">
      <auth-input
        class="phone-number-input"
        v-model="suffix_phone_number"
        name="phone_number"
        type="text"
        title="SMS Verification"
        placeholder="Phone number"
      >
        <template slot="prefix">
          <auth-input-prefix @click="open_search('search-country-code')">
            <span class="dial-code">
              {{ prefix_phone_number }}
            </span>

            <a-icon type="caret-down" />
          </auth-input-prefix>
        </template>
      </auth-input>
      <auth-input
        v-model="code"
        name="code"
        type="text"
        title="SMS Verification Code"
        placeholder="Enter the verification code"
        @suffix-action-click="send_sms_code"
      >
        <template slot="suffix">
          <auth-input-suffix
            :is-action="true"
            :disabled="!suffix_phone_number.length"
          >
            Send
          </auth-input-suffix>
        </template>
      </auth-input>

      <auth-button
        :disabled="suffix_phone_number.length || !code.length"
        @click="onSubmit"
      >
        Active
      </auth-button>
    </div>

    <search-country-code-screen
      ref="search-country-code-screen"
      @click="dial_code => (prefix_phone_number = dial_code)"
    />
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-input-prefix": () =>
      import("@/components/mobile/auth-input/prefix.vue"),
    "auth-input-suffix": () =>
      import("@/components/mobile/auth-input/suffix.vue"),
    "auth-button": () => import("@/components/mobile/auth-button"),
    "search-country-code-screen": () => import("./search.vue")
  }
})
export default class SecurityPhoneScreen extends Mixins(ScreenMixin) {
  $refs!: {
    [key: string]: any;
  };

  loading = false;
  prefix_phone_number = "+84";
  suffix_phone_number = "";
  code = "";

  get phone_number() {
    return this.prefix_phone_number + this.suffix_phone_number;
  }

  send_sms_code() {
    return;
  }

  onSubmit() {
    return;
  }

  open_search(screen: string) {
    this.$refs[`${screen}-screen`].create();
  }
}
</script>

<style lang="less">
.security-phone-screen {
  background-color: var(--bg-card-color);

  &-content {
    position: relative;
    height: calc(100% - 35px);
    padding: 12px 16px;

    > * {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .phone-number-input {
      .z-auth-input-prefix {
        display: flex;

        .dial-code {
          color: var(--text-default-color);
          font-size: 10px;
        }

        i {
          margin-left: 4px;
          line-height: 35px;
          font-size: 8px;
        }
      }
    }

    .z-auth-button {
      margin-top: 12px;
    }
  }
}
</style>
