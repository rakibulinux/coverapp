<template>
  <div class="screen-assets-preview assets-preview">
    <head-bar ref="head-bar" :title="currency.id.toUpperCase()" />
    <assets-row ref="assets-row" :currency="currency" :action-disabled="true" />
    <div
      class="assets-transaction"
      :style="{ height: `${assets_transaction_height}px` }"
    >
      <z-empty />
    </div>
    <assets-preview-tab-bar ref="tab-bar" @click="onTabBarClick" />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "assets-row": () => import("@/layouts/mobile/assets/assets-row.vue"),
    "assets-preview-tab-bar": () =>
      import("@/layouts/mobile/screens/assets/preview/tab-bar.vue")
  }
})
export default class AssetsPreviewScreen extends Mixins(ScreenMixin) {
  $refs!: {
    "head-bar": Vue;
    "assets-row": Vue;
    "tab-bar": Vue;
    "assets-transaction": Element;
  };

  currency_id!: string;

  get currency() {
    return store.state.public.currencies.find(
      currency => currency.id == this.$route.params.currency
    );
  }

  assets_transaction_height = 0;

  get height() {
    return this.$el.clientHeight;
  }

  get head_bar_height() {
    return this.$refs["head-bar"].$el.clientHeight;
  }

  get assets_row_height() {
    return this.$refs["assets-row"].$el.clientHeight;
  }

  get tab_bar_height() {
    return this.$refs["tab-bar"].$el.clientHeight;
  }

  mounted() {
    setTimeout(() => {
      this.assets_transaction_height =
        this.height -
        this.head_bar_height -
        this.assets_row_height -
        this.tab_bar_height;
    }, 300);
  }

  onTabBarClick(tab: string) {
    this.$router.push({ path: `/m/assets/${tab}/${this.currency.id}` });
  }
}
</script>

<style lang="less">
.screen-assets-preview {
  .assets-row {
    padding-left: 12px;
    padding-right: 12px;
  }

  .assets-transaction {
    overflow: auto;

    .ant-empty {
      margin-top: 35px;

      &-image {
        height: 75px;
      }

      &-description {
        font-size: 10px;
        line-height: 1;
        color: var(--color-gray);
        font-weight: 500;
      }
    }
  }

  .assets-preview-tab-bar {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;

    &-item {
      flex: 1;
      text-align: center;
    }
  }
}
</style>
