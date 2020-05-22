<template>
  <button :type="type" :disabled="disabled">
    <span v-if="loading">
      <a-icon type="loading" style="font-size: 24px" spin />
      Loading
    </span>
    <slot v-else />
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop() public readonly loading!: boolean;
  @Prop() public readonly type!: string;
  @Prop() public readonly disabled!: boolean;
}
</script>
