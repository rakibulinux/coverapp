<template>
  <a-drawer
    width="300"
    placement="left"
    :closable="false"
    :visible="isActive"
    @close="destroy"
    class="user-drawer"
  >
    <user-drawer-head @login-click="open_login_screen" />
    <user-drawer-content />
    <user-drawer-action />
  </a-drawer>
</template>

<script lang="ts">
import ZSmartModel from "@zsmartex/z-eventbus";
import DrawerTouch from "./drawer-touch";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "user-drawer-head": () => import("./user-drawer-head.vue"),
    "user-drawer-content": () => import("./user-drawer-content.vue"),
    "user-drawer-action": () => import("./user-drawer-action.vue")
  }
})
export default class HomePageDrawer extends Mixins(DrawerTouch) {
  @Prop() readonly allowTouch!: () => boolean;

  width = Math.max((window.innerWidth * 0.85).toFixedNumber(0), 300);
  isActive = false;

  mounted() {
    setTimeout(() => {
      this.create();

      this.$nextTick(() => {
        this.destroy();
      });
    }, 300);
  }

  beforeDestroy() {
    if (this.isActive) this.destroy();
  }

  create() {
    this.isActive = true;

    this.drawer_created();
  }

  destroy() {
    this.isActive = false;

    this.drawer_destroyed();
  }

  open_login_screen() {
    this.destroy();

    ZSmartModel.emit("need-login");
  }
}
</script>

<style lang="less">
.user-drawer {
  .ant-drawer-mask {
    animation: none !important;
  }

  .ant-drawer-content {
    background-color: var(--bg-card-color);
  }

  .ant-drawer-body {
    padding: 0;
  }

  &-head {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -8px;
      width: 100%;
      height: 8px;
      background-color: var(--bg-color);
    }
  }

  .user-info {
    padding: 12px 8px;
    margin-bottom: 8px;

    & > * {
      display: inline-block;
    }

    &-content {
      width: 100%;

      & > * {
        display: inline-block;
        vertical-align: middle;
      }
    }

    &-avatar {
      img {
        width: 50px;
        height: 50px;
      }
    }

    &-title {
      font-weight: bold;
      font-size: 16px;
      margin-left: 4px;
    }

    &-description {
      color: var(--color-gray);
      font-size: 10px;
    }

    &-action {
      font-size: 10px;
      text-align: center;

      &-group {
        display: flex;
        margin-top: 20px;
        padding: 0 12px;
        justify-content: space-between;
        align-items: center;
      }

      i {
        font-size: 16px;
        color: var(--blue-color);
      }
    }
  }

  &-content {
    .setting-row {
    }
  }

  &-action {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    margin-bottom: 8px;
    padding: 0 8px;

    &-item {
      height: 20px;
      line-height: 20px;
      font-size: 10px;
      display: inline-block;
      vertical-align: middle;

      span {
        display: inline-block;
      }

      i {
        margin-right: 4px;
        font-size: 14px;
        color: var(--color-gray);
        vertical-align: text-bottom;
      }
    }
  }
}
</style>
