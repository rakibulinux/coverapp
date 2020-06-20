<template>
  <div :class="['z-auth-input', { 'z-auth-input-error': !!error }]">
    <input
      ref="input"
      :value="value_input"
      :name="name"
      :type="input_type"
      autocomplete="off"
      spellcheck="off"
      :maxlength="maxlength"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @input="onInputChange"
    />
    <span
      v-if="placeholder"
      :class="[
        'z-auth-input-placeholder',
        { 'z-auth-input-placeholder-on': input_focus || value_input.length }
      ]"
      @click="onPlaceholderClick"
    >
      {{ placeholder }}
      <span
        v-if="input_focus || value_input.length"
        class="z-auth-input-placeholder-need"
      >
        {{ placeholderNeed ? "*" : "(optional)" }}
      </span>
    </span>
    <span v-if="error" class="z-auth-input-error-content">
      {{ error }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop({ default: "" }) public readonly value!: string;
  @Prop() public readonly name!: string;
  @Prop() public readonly placeholder!: string;
  @Prop({ default: false }) public readonly placeholderNeed!: boolean;
  @Prop() public readonly maxlength!: string | number;
  @Prop() public readonly type!: string;
  @Prop() public readonly prefix!: string;
  @Prop() public readonly error!: string;

  public $refs: {
    input: HTMLInputElement;
  };
  public input_focus = false;

  get value_input() {
    return (this.prefix || "") + this.value;
  }

  get input_type() {
    const { type } = this;

    return type === "number" ? "text" : type;
  }

  public onInputFocus() {
    this.input_focus = true;
  }

  public onInputBlur() {
    this.input_focus = false;
  }

  public onInputChange(event) {
    let value: string = event.target.value;
    if (this.prefix) {
      value = value.replace(this.prefix, "");
    }
    if (this.type === "number") {
      value = value.replace(/[^\d]/, "");
    }
    if (this.maxlength) {
      value = value.substring(0, Number(this.maxlength));
    }

    this.$emit("input", value);
    this.update_component();
  }

  public update_component() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  public onPlaceholderClick() {
    this.$nextTick(() => this.$refs.input.focus());
  }
}
</script>

<style lang="less">
@input-prefix-cls: ~"z-auth-input";

.@{input-prefix-cls} {
  position: relative;

  & + & {
    margin-top: 20px;
  }

  input {
    height: 50px;
    width: 100%;
    border: 1px solid;
    border-color: #314362;
    padding: 0 20px;
    font-size: 14px;
    caret-color: var(--blue-color);
    z-index: 1;
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      background-color: transparent;
      animation: autofill 0s forwards;
    }
  }

  &-placeholder {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    padding: 0 4px;
    color: var(--color-gray);
    transition: all 0.2s;
    z-index: 0;

    &-on {
      top: 0;
      left: 14px;
      background-color: var(--bg-card-color);
      color: #fff;
    }
  }

  &-error {
    input {
      border-color: var(--down-color);
    }

    .@{input-prefix-cls} {
      &-placeholder {
        color: var(--down-color);
      }
    }

    &-content {
      color: var(--down-color);
    }
  }
}

@keyframes autofill {
  100% {
    background: transparent;
    color: inherit;
  }
}
</style>
