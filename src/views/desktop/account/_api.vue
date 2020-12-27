<template>
  <div class="setting-main history">
    <div class="setting-head">
      <span v-text="$t('usercenter.api.title')" />
      <button @click="onClick('api')">
        {{ $t("usercenter.api.header.button") }}
      </button>
    </div>
    <div class="setting-body">
      <table class="table table-head">
        <thead>
          <th class="text-left" v-text="$t('table.kid')" />
          <th class="text-center" v-text="$t('table.created')" />
          <th class="text-right" v-text="$t('table.action')" />
        </thead>
      </table>
      <div class="table-content">
        <table class="table">
          <tbody>
            <tr
              v-for="data in api_keys.array"
              :key="data.kid + '-' + data.state"
              class="api-row"
            >
              <td class="text-left" v-text="data.kid" />
              <td class="text-center" v-text="getDate(data.created_at, true)" />
              <td class="text-right">
                <a-switch
                  :checked="data.state.includes('active')"
                  :loading="data.loading"
                  @change="
                    openModal(
                      data.kid,
                      data.state === 'active' ? 'disabled' : 'active',
                      'totp'
                    )
                  "
                />
                <i class="zicon-close" @click="openModal(data.kid, false, 'totp')" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <a-spin v-if="isLoading" size="large">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </a-spin>
      <a-pagination
        v-if="api_keys.max > 25"
        size="small"
        :current="api_keys.page"
        :page-size="25"
        :total="api_keys.max"
        @change="onPageChange"
      />
    </div>
    <modal-2fa ref="2fa" @success="onClick('api')" />
    <modal-api ref="api" @change-modal="onClick" />
    <modal-totp ref="totp" @submit="onSubmitTotp" @close="modalClose" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import * as helpers from "@zsmartex/z-helpers";
import Helpers from "./helpers";
import store from "@/store";

@Component({
  components: {
    "modal-2fa": () => import("@/layouts/desktop/account/_modal_2fa.vue"),
    "modal-api": () => import("@/layouts/desktop/account/_modal_api.vue"),
    "modal-totp": () => import("@/layouts/desktop/modal/_modal_totp.vue")
  }
})
export default class ApiKeyPage extends Mixins(Helpers) {
  payload_modal: {
    kid: "",
    state: "",
    modal: ""
  }

  get api_keys() {
    return store.state.user.api_keys;
  }

  get isLoading() {
    return this.api_keys.loading;
  }

  mounted() {
    if (!this.api_keys.loading)
      this.$store.dispatch("user/GET_API_KEYS", {
        page: 1,
        limit: 25
      });
  }

  modalClose() {
    const { kid } = this.payload_modal;
    const index = this.getIndexApiKey(kid);
    this.api_keys.array[index].loading = false;
    this.api_keys.array[index].state += "_";
  }

  openModal(kid, state, modal) {
    const index = this.getIndexApiKey(kid);
    this.payload_modal = { kid, state, modal };
    this.onClick(modal);
    this.api_keys.array[index].loading = true;
  }

  getIndexApiKey(kid) {
    return this.api_keys.array.findIndex(e => e.kid == kid);
  }

  onSubmitTotp(payload, totp_code) {
    if (payload.modal === "totp") this.updateApiKey(payload, totp_code);
    else this.removeApiKey(payload, totp_code);
  }

  async updateApiKey(payload, totp_code) {
    const { kid, state } = payload;
    try {
      await this.$store.dispatch("user/UPDATE_API_KEYS", {
        kid,
        state_: state,
        totp_code
      });
      this.$refs.totp.remove();
    } catch (error) {
      return error;
    }
  }

  async removeApiKey(payload, totp_code) {
    const { kid } = payload;
    try {
      await this.$store.dispatch("user/DELETE_API_KEYS", {
        kid,
        totp_code
      });
      this.$refs.totp.remove();
    } catch (error) {
      return error;
    }
  }

  onPageChange($page) {
    this.$store.dispatch("user/GET_API_KEYS", {
      page: $page,
      limit: 25
    });
  }

  getDate(date) {
    return helpers.getDate(date, true)
  }
};
</script>
