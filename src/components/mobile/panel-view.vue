<template>
  <transition name="panel-move">
    <slot class="panel-view" />
    <router-view v-if="is_mounted" class="panel-view" />
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class PanelView extends Vue {
  is_mounted = false;

  mounted() {
    this.is_mounted = true;
  }
}
</script>

<style lang="less">
@import "~@/assets/css/components/panel-view";
</style>
