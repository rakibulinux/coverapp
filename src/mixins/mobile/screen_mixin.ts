import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    "input-setting": () => import("@/components/mobile/input-setting"),
    "input-completer": () => import("@/components/mobile/input-completer"),
    "button-setting": () => import("@/components/mobile/button-setting"),
    "head-bar": () => import("@/views/mobile/modules/head-bar.vue")
  }
})
export class ScreenMixin extends Vue {
  back() {
    this.$router.back();
  }
}
