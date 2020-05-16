<template>
  <div class="input-entry text-center" :class="{ selected: isFocus }">
    <span
      v-if="turnDownUp"
      class="calc down"
      :disabled="!Number(value.value)"
      @click="NumberCalc(type, 'down')"
    >
      <i class="ic-jianhao" />
    </span>
    <input
      ref="input"
      :value="value"
      autocomplete="off"
      type="number"
      @input="$emit('input', $event.target.value)"
      @focus="changeFocus(type, true)"
      @blur="changeFocus(type, false)"
    />
    <span v-if="turnDownUp" class="calc up" @click="numberCalc(type, 'up')">
      <i class="ic-jiahao" />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    value: String | Number,
    type: String,
    isFocus: Boolean,
    changeFocus: Function,
    turnDownUp: {
      type: Boolean,
      default: true
    },
    numberCalc: Function
  },
  data: () => ({}),
  mounted() {
    if (this.isFocus) {
      this.focus();
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    clear() {
      this.$refs.input.value = "";
      this.$emit("input", "");
    }
  }
};
</script>
