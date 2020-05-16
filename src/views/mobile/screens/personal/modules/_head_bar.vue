<template>
  <action-bar class="head-bar" @on-back="$emit('on-remove')">
    <div class="center-action">
      <span v-if="loading" class="title loading">
        Loading <a-icon type="loading" />
      </span>
      <span v-else class="title">{{ title }}</span>
    </div>
  </action-bar>
</template>

<script>
import _action_bar from "@/components/mobile/action-bar.vue";

export default {
  components: {
    "action-bar": _action_bar
  },
  props: {
    title: String,
    loading: Boolean
  }
};
</script>
