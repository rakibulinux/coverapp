<template>
  <div class="ant-card" :class="{ 'ant-card-contain-tabs': tabList.length }">
    <div class="ant-card-head">
      <div class="ant-card-head-wrapper">
        <div class="ant-card-head-title">
          <slot name="title" />
          <template>{{ title }}</template>
        </div>
        <div class="ant-card-extra">
          <slot name="extra" />
        </div>
      </div>
      <a-tabs
        v-if="tabList.length"
        :activeKey="activeTabKey"
        @change="onTabChange"
      >
        <a-tab-pane v-for="row in tabList" :key="row.key" :tab="row.tab" />
      </a-tabs>
    </div>
    <div class="ant-card-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Card extends Vue {
  @Prop() public readonly title!: string;
  @Prop({ default: () => [] }) public readonly tabList!: Array<{
    key: string;
    tab: any;
  }>;
  @Prop() public readonly activeTabKey!: string;

  public onTabChange(key) {
    this.$emit("tabChange", key);
  }
}
</script>
