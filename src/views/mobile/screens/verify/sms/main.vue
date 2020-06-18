<template>
  <panel-view v-if="isShowing" class="page-verify-m"> </panel-view>
</template>

<script>
import Helpers from "@/views/mobile/helpers";
import methods from "../../methods";

export default {
  mixins: [methods, Helpers]
};
</script>
