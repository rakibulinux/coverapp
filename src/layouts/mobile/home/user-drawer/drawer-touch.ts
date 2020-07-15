import { Component, Vue } from "vue-property-decorator";

@Component
export default class DrawerTouch extends Vue {
  allowTouch!: () => boolean;

  destroy?(): void;
  create?(): void;

  isActive!: boolean;
  width!: number;

  touch_event = {
    start_x: null,
    x: null,
    touching: false
  };

  get parent_element() {
    return this.$parent.$el;
  }

  mounted() {
    this.start_touch_event(this.parent_element);
  }

  beforeDestroy() {
    this.stop_touch_event(this.parent_element);
  }

  drawer_created() {
    const drawer_mask = this.drawer_mask();
    const drawer_wrapper = this.drawer_wrapper();

    if (drawer_wrapper && drawer_mask) {
      this.start_touch_event(drawer_mask);

      drawer_mask.style.removeProperty("transition");
      drawer_mask.style.removeProperty("opacity");
      drawer_mask.style.removeProperty("height");

      drawer_wrapper.style.removeProperty("transition");
      drawer_wrapper.style.transform = "translateX(0%)";
    }
  }

  drawer_destroyed() {
    const drawer_mask = this.drawer_mask();
    const drawer_wrapper = this.drawer_wrapper();
    if (drawer_wrapper && drawer_mask) {
      this.stop_touch_event(drawer_mask);

      drawer_mask.style.removeProperty("transition");
      drawer_mask.style.removeProperty("opacity");
      drawer_mask.style.removeProperty("height");

      drawer_wrapper.style.removeProperty("transition");
      drawer_wrapper.style.transform = "translateX(-100%)";
    }
  }

  stop_touch_event(element: Element) {
    element.removeEventListener(
      "touchstart",
      (event: TouchEvent) => {
        this.handleMouseStart(event);
      },
      false
    );
    element.removeEventListener(
      "touchend",
      (event: TouchEvent) => {
        this.handleMouseOut(event);
      },
      false
    );
    element.removeEventListener(
      "touchcancel",
      (event: TouchEvent) => {
        this.handleMouseOut(event);
      },
      false
    );
    element.removeEventListener(
      "touchmove",
      (event: TouchEvent) => {
        this.handleMouseMove(event);
      },
      false
    );
  }

  start_touch_event(element: Element) {
    element.addEventListener(
      "touchstart",
      (event: TouchEvent) => {
        this.handleMouseStart(event);
      },
      false
    );
    element.addEventListener(
      "touchend",
      (event: TouchEvent) => {
        this.handleMouseOut(event);
      },
      false
    );
    element.addEventListener(
      "touchcancel",
      (event: TouchEvent) => {
        this.handleMouseOut(event);
      },
      false
    );
    element.addEventListener(
      "touchmove",
      (event: TouchEvent) => {
        this.handleMouseMove(event);
      },
      false
    );
  }

  handleMouseStart(event: TouchEvent) {
    if (!event.touches) return;
    if (!event.touches.length) return;

    const offsetX = event.touches[0].clientX;

    this.touch_event.start_x = offsetX;

    if (event.target !== this.drawer_mask()) {
      this.touch_event.touching = true;
    }
  }

  handleMouseOut(event: TouchEvent) {
    this.touch_event.x = event.changedTouches[0].clientX;
    if (this.touch_event.x < this.width / 2) {
      this.$el.classList.remove("ant-drawer-open");
      this.destroy();
    } else {
      if (this.touch_event.start_x <= window.innerWidth / 15 || this.isActive) this.create();
    }

    this.touch_event.start_x = null;
    this.touch_event.x = null;
    this.touch_event.touching = false;

    const drawer_wrapper = this.drawer_wrapper();
    if (!drawer_wrapper) return;

    drawer_wrapper.style.removeProperty("transition");
  }

  handleMouseMove(event: TouchEvent) {
    if (!this.allowTouch()) return;
    const drawer_mask = this.drawer_mask();

    if (!event.touches) return;
    if (!event.touches.length) return;
    if (
      event.target !== drawer_mask &&
      this.touch_event.start_x > window.innerWidth / 15
    ) {
      return;
    }
    event.preventDefault();

    this.touch_event.x = event.touches[0].clientX;

    this.move_drawer(this.touch_event.x);
  }

  drawer_wrapper() {
    const drawer_wrapper = document.querySelector(
      ".ant-drawer-content-wrapper"
    ) as undefined | HTMLElement;

    return drawer_wrapper;
  }

  drawer_mask() {
    const drawer_mask = document.querySelector(".ant-drawer-mask") as
      | undefined
      | HTMLElement;

    return drawer_mask;
  }

  move_drawer(offsetX: number) {
    const drawer_mask = this.drawer_mask();
    const drawer_wrapper = this.drawer_wrapper();
    if (!drawer_wrapper) return;

    const translateX = Math.max(
      Math.min(((offsetX / this.width) * 100 - 100).toFixedNumber(0), 0),
      -100
    );

    drawer_mask.style.opacity = `${translateX + 100}%`;
    drawer_mask.style.height = "100%";
    drawer_mask.style.transition = "none";

    drawer_wrapper.style.transition = "none";
    drawer_wrapper.style.transform = `translateX(${translateX}%)`;

    if (translateX === -100) {
      this.$el.classList.remove("ant-drawer-open");
    } else {
      this.$el.classList.add("ant-drawer-open");
    }
  }
}
