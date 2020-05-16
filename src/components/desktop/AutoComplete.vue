<template>
  <div class="autocomplete" :class="[{ selected }, type]">
    <div v-if="selected" class="mask" @click="selected = !selected" />
    <div class="select-con" @click="selected = !selected">
      <div class="con">
        {{ show_value }}
      </div>
      <div class="more">
        <i class="ic-arrow-caret-down" />
      </div>
    </div>
    <ul class="list">
      <li
        v-for="(data, index) in rows"
        :key="index"
        @click="changeSelect(data)"
        v-text="show_data(data)"
      />
    </ul>
  </div>
</template>

<script>
import ZSmartModel from "@zsmartex/z-eventbus";

export default {
  props: ["rows", "width", "default_value", "event", "type"],
  data() {
    return {
      selected: false,
      value: this.default_value
    };
  },
  computed: {
    isName() {
      return ["region", "market"].includes(this.event);
    },
    show_value() {
      if (this.isName) return this.value.name;
      else return this.value;
    }
  },
  methods: {
    show_data(data) {
      if (this.isName) return data.name;
      else return data;
    },
    changeSelect(data) {
      ZSmartModel.emit(this.event, data);
      this.value = data;
      this.selected = !this.selected;
    }
  }
};
</script>
