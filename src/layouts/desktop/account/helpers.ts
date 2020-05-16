import _need_security from "@/layouts/desktop/account/_need_security.vue";
import * as helpers from "@zsmartex/z-helpers";

export default {
  data: () => ({
    modal: {
      enabled: false,
      loading_button: false
    }
  }),
  methods: {
    render() {
      this.modal.enabled = true;
      if (typeof this.onRender === "function") this.onRender();
    },
    remove() {
      this.modal.enabled = false;
      if (typeof this.onRemove === "function") this.onRemove();
    },
    onChangeShow() {
      if (!this.modal.enabled) this.resetInput();
    },
    resetStep() {
      this.step = 1;
    },
    translation: (message, data = {}) =>
      helpers.translation("modal." + message, data),
    closeModal() {
      this.remove();
    },
    changeModal(modal) {
      this.remove();
      this.$emit("changeModal", modal);
    }
  },
  components: {
    "need-security": _need_security
  }
};
