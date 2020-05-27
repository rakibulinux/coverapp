<template>
  <div class="head-bar">
    <a-icon type="search" />
    <input
      type="text"
      :value="value"
      placeholder="Please input Keywords"
      @input="$emit('input', $event.target.value)"
    />
    <span class="cancel" @click="$emit('on-remove')">Cancel</span>
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Number]
  }
};
</script>
