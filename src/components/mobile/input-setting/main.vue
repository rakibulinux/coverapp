<template>
  <div class="input-setting-m">
    <div v-if="placeholder" class="input-label">
      {{ placeholder }}
    </div>
    <input
      :value="value"
      :type="type"
      :maxlength="maxlength"
      @input="$emit('input', $event.target.value)"
    />
    <slot name="right" />
  </div>
</template>

<script>
export default {
  props: {
    value: String | Number,
    placeholder: String,
    type: {
      type: String,
      default: "text"
    },
    maxlength: String
  },
  computed: {},
  watch: {
    value() {
      const { maxlength } = this;

      if (this.maxlength) this.$emit("input", this.value.slice(0, maxlength));
    }
  }
};
</script>
