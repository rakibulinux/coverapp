<template>
  <transition name="panel-move">
    <div class="panel-view">
      <slot />
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class PanelView extends Vue {}
</script>

<style lang="less">
.panel-move {
  &-enter,
  &-leave-active {
    transform: translate(0, 100%);
  }

  &-enter-active,
  &-leave-active {
    transition: transform 0.3s;
  }
}

.panel-view {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 999;
  background-color: #0e182b;
}
</style>
