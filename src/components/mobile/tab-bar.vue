<template>
  <div class="cube-tab-bar" :class="{ 'cube-tab-bar_inline': inline }">
    <slot />
    <div v-if="showSlider" ref="slider" class="cube-tab-bar-slider"></div>
  </div>
</template>

<script>
import { prefixStyle } from "cube-ui/src/common/helpers/dom";
import { findIndex } from "cube-ui/src/common/helpers/util";

const EVENT_INPUT = "input";
const EVENT_CHANGE = "change";
const EVENT_CLICK = "click";

const TRANSFORM = prefixStyle("transform");
const TRANSITION = prefixStyle("transition");

export default {
  components: {},
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    inline: {
      type: Boolean,
      default: false
    },
    showSlider: {
      type: Boolean,
      default: false
    },
    sliderBig: {
      type: Boolean,
      default: false
    },
    useTransition: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value() {
      this._updateSliderStyle();
    }
  },
  created() {
    this.tabs = [];
  },
  mounted() {
    this._updateSliderStyle();
    window.addEventListener("resize", this._resizeHandler);
  },
  activated() {
    /* istanbul ignore next */
    window.addEventListener("resize", this._resizeHandler);
  },
  deactivated() {
    /* istanbul ignore next */
    this._cleanUp();
  },
  beforeDestroy() {
    /* istanbul ignore next */
    this._cleanUp();
  },
  methods: {
    addTab(tab) {
      this.tabs.push(tab);
    },
    removeTab(tab) {
      const index = this.tabs.indexOf(tab);
      if (index > -1) this.tabs.splice(index, 1);
    },
    trigger(value) {
      // emit click event as long as tab is clicked
      this.$emit(EVENT_CLICK, value);
      // only when value changed, emit change & input event
      if (value !== this.value) {
        const changedEvents = [EVENT_INPUT, EVENT_CHANGE];
        changedEvents.forEach(eventType => {
          this.$emit(eventType, value);
        });
      }
    },
    _updateSliderStyle() {
      /* istanbul ignore if */
      if (!this.showSlider) return;
      const slider = this.$refs.slider;
      this.$nextTick(() => {
        const { width, index } = this._getSliderWidthAndIndex();
        slider.style.width = `${width}px`;
        this.setSliderTransform(this._getOffsetLeft(index));
      });
    },
    setSliderTransform(offset) {
      const slider = this.$refs.slider;
      if (typeof offset === "number") {
        offset = `${offset}px`;
      }
      if (slider) {
        if (this.useTransition)
          slider.style[TRANSITION] = `${TRANSFORM} 0.2s linear`;
        slider.style[TRANSFORM] = `translateX(${offset}) translateZ(0)`;
      }
    },
    _getSliderWidthAndIndex() {
      const width = 0;
      let index = 0;
      let left = 0;
      if (this.tabs.length > 0) {
        index = findIndex(this.tabs, tab => tab.value === this.value);
        //TODO: add width to this
        if (this.sliderBig) {
          //width = $(this.tabs[index].$el).width();
        } else {
          //width = $(this.tabs[index].$el.children[0]).width();
        }
        left = width / 4;
      }
      return {
        width,
        left,
        index
      };
    },
    _getOffsetLeft(index) {
      return; //$(this.tabs[index].$el.children[0]).offset().left || 0;
    },
    _resizeHandler() {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => {
        this._updateSliderStyle();
      }, 60);
    },
    _cleanUp() {
      clearTimeout(this._resizeTimer);
      window.removeEventListener("resize", this._resizeHandler);
    }
  }
};
</script>
