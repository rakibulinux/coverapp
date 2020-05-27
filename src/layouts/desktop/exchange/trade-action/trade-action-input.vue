<template>
  <div
    :class="['trade-action-input', { 'trade-action-input-error': error }]"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
  >
    <a-tooltip :visible="!!error && allow_tooltip">
      <template slot="title">
        {{ error }}
      </template>
      <span v-if="prefix" class="trade-action-input-prefix">{{ prefix }}</span>
      <input
        @input="onInputChange"
        @focus="onInputFocus"
        @blur="onInputBlur"
        :value="value"
        type="text"
      />
      <span v-if="suffix" class="trade-action-input-suffix">{{ suffix }}</span>
      <div
        v-if="input_focus && value && estimateValue && !error"
        class="trade-action-input-estimate"
      >
        ≈ {{ estimateValue }} USD
      </div>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop() public readonly value!: string;
  @Prop() public readonly prefix!: string;
  @Prop() public readonly suffix!: string;
  @Prop() public readonly estimateValue!: string;
  @Prop() public readonly limitLengthAfterDot!: number;
  @Prop({ default: false }) public readonly estimate!: boolean;
  @Prop() public readonly error!: boolean;

  public allow_tooltip = false;
  public input_error_class = "ant-input-error";
  public input_focus = false;

  public onInputChange(event) {
    this.input_focus = true;
    const { value } = event.target;

    this.commit_value(value);
  }

  public onInputFocus() {
    this.input_focus = true;
  }

  public onInputBlur() {
    this.input_focus = false;
  }

  public string_to_number(value: string) {
    return value.replace(/[^0-9.]/g, "");
  }

  public update_component() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  public before_commit_value(value: string) {
    value = value
      .split(".")
      .filter((val, index) => index <= 1)
      .map(val => this.string_to_number(val))
      .join("."); // Remove all string

    value = value
      .split(".")
      .map((val, index) => {
        if (!index) {
          return val;
        } // for index key is zero

        if (val.length > this.limitLengthAfterDot) {
          return val.substring(0, val.length - 1);
        }
        return val;
      })
      .join(".");

    return value;
  }

  public commit_value(value: string) {
    value = this.before_commit_value(value);
    this.$emit("input", value);
    this.update_component();
  }

  public mouseover() {
    this.allow_tooltip = true;
  }

  public mouseleave() {
    this.allow_tooltip = false;
  }

  @Watch("value")
  public onValueChanged(value: string) {
    this.commit_value(value);
  }
}
</script>

<style lang="less">
.trade-action-input {
  position: relative;

  input {
    height: 35px;
    width: 100%;
    border: 1px solid;
    border-radius: 4px;
    border-color: #314363;
    padding: 0 75px !important;
  }

  &-error {
    .trade-action-input {
      &-prefix,
      &-suffix {
        color: var(--down-color);
      }
    }

    input {
      background-color: #f356562b !important;
      border-color: #ef4d4d !important;
    }
  }

  &-prefix,
  &-suffix {
    color: var(--color-gray);
    position: absolute;
    font-size: 12px;
    top: 50%;
    transform: translateY(-50%);
  }

  &-prefix {
    left: 16px;
  }

  &-suffix {
    right: 16px;
  }

  &-estimate {
    width: 100%;
    position: absolute;
    bottom: -8px;
    left: 0;
    border-radius: 0 0 3px 3px;
    height: 14px;
    line-height: 14px;
    font-size: 11px;
    background-color: #0095ff;
    padding-left: 16px;
    color: white;
  }
}
</style>
