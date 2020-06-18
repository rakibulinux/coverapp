<template>
  <panel-view v-if="isShowing" class="screen-personal-m language">
    <head-bar title="Language" @on-remove="remove()" />
    <div class="body-bar">
      <div class="setting-list">
        <setting-group :no-background="true">
          <setting-row
            v-for="(data, index) in messages"
            :key="index"
            :allow-icon="locale === data.name"
            type="success"
            :icon-class="{ selected: locale === data.name }"
            @click="setLanguage(index)"
          >
            {{ data.name }}
          </setting-row>
        </setting-group>
      </div>
    </div>
  </panel-view>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";
import config from "@/config";
import { i18n } from "@/plugins";
import Helpers from "../helpers";

export default {
  mixins: [Helpers],
  computed: {
    locale() {
      return this.$t("name");
    },
    messages() {
      return config.messages;
    }
  },
  methods: {
    setLanguage(locale) {
      if (this.locale === locale) return;
      localStorage.setItem("LANGUAGE_HASH", locale);
      i18n.locale = locale;
      ZSmartModel.on("change-language");
    }
  }
};
</script>
