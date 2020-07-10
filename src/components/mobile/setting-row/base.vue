<template>
  <div class="setting-row" @click="$emit('click')">
    <div class="setting-row-content">
      <a-icon :type="data.icon" theme="filled" />
      <span class="setting-row-value">
        {{ data.text }}
      </span>
    </div>
    <div class="setting-row-action">
      <a-icon type="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface SettingData {
  icon?: string;
  text: string;
}

@Component
export default class SettingRow extends Vue {
  @Prop() readonly data!: SettingData;
}
</script>

<style lang="less">
.setting-row {
  height: 35px;
  line-height: 35px;
  display: flex;
  padding: 0 8px;
  border-bottom: 1px solid var(--bg-color);
  justify-content: space-between;
  align-items: center;

  &-content {
    font-size: 10px;
  }

  &-value {
    margin-left: 4px;
    font-size: 12px;
  }

  i {
    color: var(--color-gray);
  }
}
</style>
