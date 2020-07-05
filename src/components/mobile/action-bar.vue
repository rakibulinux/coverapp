<template>
  <div :class="['action-bar']">
    <div v-if="!leftDisabled" class="back left-action">
      <a-icon type="left" @click="$emit('back')" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ActionBar extends Vue {
  @Prop({ default: false }) readonly leftDisabled!: boolean;
}
</script>

<style lang="less">
.action-bar {
  background-color: var(--bg-card-color);
  position: relative;
  height: 35px;

  .left-action,
  .center-action,
  .right-action {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    i {
      font-size: 18px;
      color: var(--color-gray);
    }
  }

  .left-action {
    left: 8px;
  }

  .center-action {
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .right-action {
    right: 8px;
  }

  .loading i {
    color: var(--blue-color);
  }
}
</style>
