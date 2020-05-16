<template>
  <z-content class="page-home">
    <preview />
    <feature-markets class="container" />
    <market-list class="container" />
    <advantages class="container" />
  </z-content>
</template>

<script>
import _preview from "@/layouts/desktop/home/_preview.vue";
import _market_list from "@/layouts/desktop/home/_market_list.vue";
import _feature_markets from "@/layouts/desktop/home/_feature_markets.vue";
import _advantages from "@/layouts/desktop/home/_advantages.vue";

export default {
  components: {
    preview: _preview,
    "market-list": _market_list,
    "feature-markets": _feature_markets,
    advantages: _advantages
  },
  created() {
    if (localStorage.getItem("favorites") === null)
      localStorage.setItem("favorites", "");
  }
};
</script>
