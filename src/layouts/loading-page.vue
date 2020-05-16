<template>
  <div :class="['page-loading', { transparent }]">
    <div class="spinner">
      <div class="rect1" />
      <div class="rect2" />
      <div class="rect3" />
      <div class="rect4" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    transparent: Boolean
  }
};
</script>
