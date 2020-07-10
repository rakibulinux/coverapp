import PanelView from "@/components/mobile/panel-view.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    "head-bar": () => import("@/views/mobile/modules/head-bar.vue"),
    "panel-view": PanelView,
  },
})
export class ScreenMixin extends Vue {
  before_panel_create?(payload?: any): void;
  panel_created?(payload?: any): void;
  before_panel_destroy?(payload?: any): void;
  panel_destroyed?(payload?: any): void;

  private PanelView!: {
    isActive: boolean;
  };

  private get isActive(): boolean {
    if (!this.PanelView) return false;

    return this.PanelView.isActive;
  }

  private set isActive(value: boolean) {
    if (!this.PanelView) return;

    this.PanelView.isActive = value;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  create(payload?: any) {
    if (!this.PanelView) throw "PanelView is not ready";
    if (typeof this.before_panel_create === "function") {
      this.before_panel_create(payload);
    }
    this.isActive = true;

    this.$nextTick(() => {
      if (typeof this.panel_created === "function") {
        this.panel_created(payload);
      }
    });
  }

  destroy(payload?: any) {
    if (!this.PanelView) throw "PanelView is not ready";
    if (typeof this.before_panel_destroy === "function") {
      this.before_panel_destroy(payload);
    }

    this.isActive = false;

    this.$nextTick(() => {
      if (typeof this.panel_destroyed === "function") {
        this.panel_destroyed(payload);
      }
    });
  }
}
