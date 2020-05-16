<template>
  <div :class="['action-bar', { transparent: transparent }]">
    <div v-if="!leftDisabled" class="back left-action">
      <i class="ic-arrow-back" @click="back()" />
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    leftDisabled: {
      type: Boolean,
      required: false
    },
    transparent: Boolean
  },
  methods: {
    back() {
      this.$emit("on-back");
    }
  }
};
</script>