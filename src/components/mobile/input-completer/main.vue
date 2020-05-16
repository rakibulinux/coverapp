<template>
  <div :class="['input-completer', { prefix: !!prefix }]">
    <div v-if="label" class="input-label">
      {{ label }}
    </div>
    <span v-if="!!prefix" class="prefix-content">
      {{ prefix }}
    </span>
    <input
      :value="value"
      :placeholder="placeholder"
      :type="type"
      :maxlength="maxlength"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
    />
    <div class="right-action">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    maxlength: {
      type: [String, Number],
      default: ""
    },
    prefix: String,
    disabled: Boolean
  },
  watch: {
    value() {
      const { maxlength } = this;

      if (this.maxlength) this.$emit("input", this.value.slice(0, maxlength));
    }
  }
};
</script>
