<template>
  <div class="head-bar">
    <div class="head">
      <div class="title">
        Markets
      </div>
      <a-icon type="search" @click="showPanel()" />
    </div>
    <cube-tab-bar
      :value="selected"
      show-slider
      class="action-menu"
      @click="trigger"
    >
      <tab
        v-for="item in ['Favorites', ...list_bid]"
        :key="item"
        :name="item"
        :label="item"
      >
        <span v-text="item" />
      </tab>
    </cube-tab-bar>
  </div>
</template>

<script>
import config from "@/config";
import tab from "@/components/mobile/tab.vue";

export default {
  components: {
    tab
  },
  props: {
    selected: [String, Number]
  },
  computed: {
    list_bid() {
      return [...config.list_bid1, ...config.list_bid2];
    }
  },
  methods: {
    showPanel() {
      this.$emit("on-open-screen", "");
    },
    trigger(value) {
      this.$emit("change", value);
    }
  }
};
</script>
