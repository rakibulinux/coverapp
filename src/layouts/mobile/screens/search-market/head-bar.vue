<template>
  <div class="head-bar">
    <a-icon type="search" />
    <input
      type="text"
      :value="value"
      placeholder="Please input Keywords"
      @input="$emit('input', $event.target.value)"
    />
    <span class="cancel" @click="$emit('cancel')">Cancel</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SearchMarketScreenHeadBar extends Vue {
  @Prop() readonly value!: string;
}
</script>
