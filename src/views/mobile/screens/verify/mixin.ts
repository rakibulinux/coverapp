import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button"),
    "panel-view": () => import("@/components/mobile/panel-view.vue")
  }
})
export default class VerifyMixin extends Vue {
  isShowing = false;

  create() {
    this.isShowing = true;

    if (typeof (this as any).onCreate === "function") {
      (this as any).onCreate();
    }
  }

  close() {
    this.isShowing = false;
  }
}
