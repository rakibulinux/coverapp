<template>
  <div :class="['z-auth-input', { 'z-auth-input-error': !!error }]">
    <div v-if="title" class="z-auth-input-title">
      {{ title }}
    </div>
    <div class="z-auth-input-content">
      <slot v-if="$slots.prefix" name="prefix" />
      <input
        :value="value"
        :name="name"
        :type="input_type"
        :placeholder="placeholder"
        autocomplete="off"
        spellcheck="off"
        @focus="onInputFocus"
        @blur="onInputBlur"
        @input="onInputChange"
      />
      <div v-if="$slots.suffix" class="z-auth-input-suffix">
        <slot name="suffix" />
      </div>
      <div class="z-auth-input-action">
        <div
          v-if="type === 'password' && value.length"
          class="z-auth-input-action-item"
          @click="commit_value('')"
        >
          <a-icon type="close" />
        </div>
        <div
          v-if="type === 'password'"
          class="z-auth-input-action-item"
          @click="showing_password = !showing_password"
        >
          <a-icon v-if="!showing_password" type="eye-invisible" />
          <a-icon v-if="showing_password" type="eye" />
        </div>
        <slot name="action" />
      </div>
    </div>

    <div v-if="error" class="z-auth-input-error-content">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AuthInput extends Vue {
  @Prop({ default: "" }) readonly value!: string;
  @Prop() readonly name!: string;
  @Prop() readonly title!: string;
  @Prop() readonly placeholder!: string;
  @Prop() readonly maxlength!: string | number;
  @Prop() readonly type!: string;
  @Prop() readonly error!: string;

  input_focus = false;
  showing_password = false;

  get input_type() {
    let { type } = this;
    if (type === "password" && this.showing_password) type = "text";

    return type;
  }

  get value_input() {
    return this.value;
  }

  onInputFocus() {
    this.input_focus = true;
  }

  onInputBlur() {
    this.input_focus = false;
  }

  onInputChange(event) {
    let value: string = event.target.value;
    if (this.type === "number") {
      value = value.replace(/[^\d]/, "");
    }
    if (this.maxlength) {
      value = value.substring(0, Number(this.maxlength));
    }

    this.commit_value(value);
  }

  commit_value(value: string) {
    this.$emit("input", value);
    this.update_component();
  }

  update_component() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }
}
</script>

<style lang="less">
@auth-input-height: 32px;

.z-auth-input {
  position: relative;
  text-align: left;

  &-title {
    font-size: 10px;
    margin-bottom: 2px;
    font-weight: 500;
    color: var(--color-gray);
  }

  &-content {
    position: relative;
    display: flex;
    width: 100%;

    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  input {
    display: inline-block;
    width: 100%;
    height: @auth-input-height;
    padding: 0 8px;
    font-size: 11px;
    font-weight: normal;

    &::placeholder {
      font-size: 11px;
      font-weight: 500;
      color: #979ca5;
    }
  }

  &-prefix {
    border-right: 1px solid;
  }

  &-suffix {
    border-left: 1px solid;
  }

  &-prefix,
  &-suffix {
    display: inline-block;
    height: @auth-input-height;
    line-height: @auth-input-height;
    padding: 0 8px;
    color: var(--color-gray);
    font-weight: 500;
    border-color: var(--border-color);

    > * {
      height: 100%;
    }
  }

  &-suffix-action {
    position: absolute;
    right: 0;
    top: -1px;

    display: inline-block;
    height: @auth-input-height + 2;
    line-height: @auth-input-height + 2;
    padding: 0 16px;
    background-color: var(--disabled-color);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    &-disabled {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  &-action {
    display: flex;
    position: absolute;
    top: 0;
    right: 8px;
    line-height: @auth-input-height;

    &-item {
      color: var(--color-gray);
      margin: 0 4px;
      i {
        font-size: 12px;
      }
    }
  }

  &-error &-content {
    border-color: var(--down-color);
  }

  &-error-content {
    position: absolute;
    line-height: 1;
    top: 100%;
    font-size: 8px;
    color: var(--down-color);
  }
}
</style>
