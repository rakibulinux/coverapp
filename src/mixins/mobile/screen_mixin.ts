
import ZSmartModel from "@zsmartex/z-eventbus";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    "panel-view": () => import("@/components/mobile/panel-view.vue"),
    "input-setting": () => import("@/components/mobile/input-setting"),
    "input-completer": () => import("@/components/mobile/input-completer"),
    "button-setting": () => import("@/components/mobile/button-setting"),
    "head-bar": () => import("@/views/mobile/modules/head-bar.vue")
  }
})
export class ScreenMixin extends Vue {
  isShowing = false;
  public onCreate?(args?): void;
  public onDelete?(args?): void;

  mounted() {
    ZSmartModel.on("close-panel-view", () => {
      this.delete();
    });
  }

  beforeDestroy() {
    ZSmartModel.remove("close-panel-view");
  }

  create(args?) {
    this.isShowing = true;
    if (typeof this.onCreate === "function") this.onCreate(args);
  }

  delete(args?) {
    this.isShowing = false;
    if (typeof this.onDelete === "function") this.onDelete(args);
  }
}