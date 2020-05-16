<template>
  <a-input-group size="large" class="auth-input">
    <label v-if="prefix" class="prefix" v-text="prefix" />
    <a-input
      ref="input"
      :class="[className, 'ant-input-copy']"
      autocomplete="off"
      spellcheck="false"
      :type="getType"
      :name="name"
      :maxlength="maxlength"
      :value="value"
      :disabled="disabled || copy"
      @input="$emit('input', $event.target.value)"
      @keypress="onlyNumberInput"
    />
    <label
      ref="label"
      :class="['placeholder', { disabled: disabled || copy }, labelClass]"
      @click="onLabelClick"
    >
      {{ placeholder }}
      <span v-if="labelNeed" class="need">*</span>
      <span v-else class="optional">(optional)</span>
    </label>
    <div v-if="enableVaild" class="berror">
      {{ errorText }}
    </div>
  </a-input-group>
</template>

<script>
export default {
  props: {
    name: String,
    value: String,
    type: {
      type: String,
      required: false,
      default: "text"
    },
    className: Array | Object,
    prefix: String | Number,
    labelClass: Array | Object,
    placeholder: String,
    labelNeed: {
      type: Boolean,
      required: false,
      default: false
    },
    enableVaild: Boolean,
    errorText: String,
    maxlength: String | Number,
    disabled: Boolean,
    copy: Boolean
  },
  computed: {
    getType() {
      const { type } = this;
      if (type === "number") return "text";
      else return type;
    }
  },
  methods: {
    onlyNumberInput($event) {
      if (this.type === "number") {
        const charCode = $event.which ? $event.which : $event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
          return $event.preventDefault();
      }
    },
    addError() {
      this.$refs.input.classList.add("ierror");
      this.$refs.label.classList.add("berror");
    },
    removeError() {
      this.$refs.input.classList.remove("ierror");
      this.$refs.label.classList.remove("berror");
    },
    onLabelClick() {
      this.$nextTick(() => this.$refs.input.focus());
    },
    clear() {
      this.$refs.input.value = "";
      this.$emit("input", "");
    }
  }
};
</script>
