<template>
  <action-bar class="head-bar" @on-back="$emit('on-remove')">
    <div class="center-action">
      <span class="title">{{ title }}</span>
    </div>
  </action-bar>
</template>

<script>
import _action_bar from "@/components/mobile/action-bar.vue";

export default {
  props: {
    title: String
  },
  components: {
    "action-bar": _action_bar
  }
};
</script>
