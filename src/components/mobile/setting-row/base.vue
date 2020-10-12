<template>
  <div class="setting-row" @click="$emit('click')">
    <div class="setting-row-content">
      <a-icon v-if="icon" :type="icon" theme="filled" />
      <span class="setting-row-title">
        <slot />
      </span>
    </div>
    <div class="setting-row-value">
      <span>{{ value }}</span>

      <div v-if="clickable" class="setting-row-action">
        <a-icon type="right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SettingRow extends Vue {
  @Prop() readonly icon!: string;
  @Prop() readonly value!: string;
  @Prop({ default: true }) readonly clickable!: boolean;
}
</script>

<style lang="less">
.setting-row {
  position: relative;
  height: 40px;
  line-height: 40px;
  width: 100%;
  display: block;
  padding: 0 8px;
  border-bottom: 1px solid var(--bg-color);
  justify-content: space-between;
  align-items: center;

  &-content {
    font-size: 10px;
  }

  &-title {
    margin-left: 4px;
    font-size: 12px;
  }

  &-value {
    position: absolute;
    top: 0;
    right: 12px;
    height: 100%;
    color: var(--color-gray);
    font-size: 10px;
    display: flex;
  }

  &-action {
    line-height: 1;
    margin: auto;
  }

  i {
    color: var(--color-gray);
    vertical-align: text-bottom;
  }
}
</style>

<style lang="less">
.setting-row {
  background-color: var(--bg-card-color);
}

[ripple] .ripple--container .ripple--body {
  will-change: transform, opacity, auto;
  zoom: 1;
  overflow: hidden;
  transform: scale(0);
  border-radius: 100%;
  position: absolute;
  opacity: 0.5;
  background-color: rgba(255, 255, 255, 0.05);
  animation: rippler 500ms;
}
@-webkit-keyframes rippler {
  to {
    opacity: 0;
    transform: scale(2);
  }
}
@-moz-keyframes rippler {
  to {
    opacity: 0;
    transform: scale(2);
  }
}
@-o-keyframes rippler {
  to {
    opacity: 0;
    transform: scale(2);
  }
}
@keyframes rippler {
  to {
    opacity: 0;
    transform: scale(2);
  }
}
</style>
