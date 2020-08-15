<template>
  <div class="z-step">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="z-step-item"
      :class="{ 'z-step-item-active': value >= index + 1 }"
    >
      <div class="z-step-item-icon">
        <span>{{ index + 1 }}</span>
      </div>
      <div class="z-step-item-content">
        <span>{{ step.text }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface Step {
  text: string;
  done: boolean;
}

@Component
export default class ZStep extends Vue {
  @Prop() readonly steps!: Step[];
  @Prop() readonly value!: number;
}
</script>

<style lang="less">
.z-step {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-item {
    flex: 1;
    position: relative;
    text-align: center;
    color: var(--color-gray);

    &-icon {
      position: relative;
      width: 16px;
      height: 16px;
      margin: auto;
      border: 1px solid;
      border-radius: 16px;
      font-size: 10px;
      font-weight: 500;
      background-color: var(--bg-card-color);

      > span {
        width: 16px;
        height: 16px;
        line-height: 16px;
        position: relative;
        top: -1px;
      }
    }

    &-icon {
      display: block;
    }

    &-content {
      position: relative;
      font-size: 8px;
      font-weight: 500;
      width: 50%;
      height: 100%;
      margin: 0 auto;

      span {
        position: absolute;
        left: 0;
        width: 100%;
        word-break: break-word;
        line-height: 10px;
      }
    }

    &-active {
      color: var(--blue-color);

      .z-step-item-icon {
        background-color: var(--blue-color);
        color: var(--bg-card-color);
        border-color: var(--blue-color);
      }
    }

    &:not(:last-child):before {
      content: "";
      position: absolute;
      top: 16px / 2;
      left: 50%;
      width: calc(100% - 16px);
      margin-left: 16px / 2;
      display: block;
      border-bottom: 1px dashed var(--color-gray);
      z-index: 0;
    }
  }
}
</style>
