import { Picker, Slide, TabPanels, TabBar, RecycleList, Loading } from 'cube-ui';
import "cube-ui/lib/scroll/style.css";
import "cube-ui/lib/slide/style.css";
import "cube-ui/lib/scroll/style.css";
import "cube-ui/lib/recycle-list/style.css";
import "cube-ui/lib/loading/style.css";
import Vue from "vue";

Vue.use(TabPanels);
Vue.use(Picker);
Vue.use(Slide);
Vue.use(RecycleList);
Vue.use(Loading);

(TabBar as any).mounted = function () {
  this._updateSliderStyle = function() {
    /* istanbul ignore if */
    if (!this.showSlider) return;
    const slider = this.$refs.slider;
    this.$nextTick(() => {
      const { width, index } = this._getSliderWidthAndIndex();
      slider.style.width = `16px`;
      this.setSliderTransform(this._getOffsetLeft(index) + width / 2 - 8);
    });
  }

  this._updateSliderStyle();
  window.addEventListener("resize", this._resizeHandler);
};


Vue.use(TabBar);

import CubeScroll from "./cube-scroll.vue";

Vue.component("cube-scroll", CubeScroll);
