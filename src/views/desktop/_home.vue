<template>
  <z-content class="page-home">
    <preview />
    <feature-markets class="container" />
    <market-list class="container" />
    <advantages class="container" />
  </z-content>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    preview: () => import("@/layouts/desktop/home/_preview.vue"),
    "market-list": () => import("@/layouts/desktop/home/market-list"),
    "feature-markets": () =>
      import("@/layouts/desktop/home/_feature_markets.vue"),
    advantages: () => import("@/layouts/desktop/home/_advantages.vue"),
  },
})
export default class Home extends Vue {
  page = 1;

  created() {
    if (localStorage.getItem("favorites") === null)
      localStorage.setItem("favorites", "");
  }
}
</script>
