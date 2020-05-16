import _button_setting from "@/components/mobile/button-setting";
import _input_completer from "@/components/mobile/input-completer";
import _input_setting from "@/components/mobile/input-setting";
import _panel_view from "@/components/mobile/panel-view.vue";
import ZSmartModel from "@zsmartex/z-eventbus";
import componentsInclude from "../components-include";

export default {
  mixins: [componentsInclude],
  data: () => ({
    isShowing: false
  }),
  methods: {
    render(args = null) {
      this.isShowing = true;
      if (typeof this.onRender === "function") this.onRender(args);
    },
    remove(args = null) {
      this.isShowing = false;
      if (typeof this.onRemove === "function") this.onRemove(args);
    }
  },
  mounted() {
    ZSmartModel.on("close-panel-view", () => {
      this.remove();
    });
  },
  beforeDestroy() {
    ZSmartModel.remove("close-panel-view");
  },
  components: {
    "panel-view": _panel_view,
    "input-setting": _input_setting,
    "input-completer": _input_completer,
    "button-setting": _button_setting
  }
};
