<template>
  <div :class="['z-auth-input', { 'z-auth-input-error': !!error }]">
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

    <div v-if="error" class="z-auth-input-error-content">
      {{ error }}
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
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AuthInput extends Vue {
  @Prop({ default: "" }) readonly value!: string;
  @Prop() readonly name!: string;
  @Prop() public readonly placeholder!: string;
  @Prop() readonly maxlength!: string | number;
  @Prop() readonly type!: string;
  @Prop() readonly prefix!: string;
  @Prop() readonly error!: string;

  input_focus = false;
  showing_password = false;

  get input_type() {
    let { type } = this;
    if (type === "number") type = "text";
    if (type === "password" && this.showing_password) type = "text";

    return type;
  }

  get value_input() {
    return (this.prefix || "") + this.value;
  }

  onInputFocus() {
    this.input_focus = true;
  }

  onInputBlur() {
    this.input_focus = false;
  }

  onInputChange(event) {
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
@auth-input-height: 35px;

.z-auth-input {
  position: relative;
  height: @auth-input-height + 15px;

  input {
    width: 100%;
    height: @auth-input-height;
    padding: 0 8px;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    border-radius: 2px;
    font-weight: normal;

    &::placeholder {
      font-size: 12px;
      font-weight: normal;
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

  &-error {
    input {
      border-color: var(--down-color);
    }

    &-content {
      font-size: 8px;
      color: var(--down-color);
    }
  }
}
</style>
