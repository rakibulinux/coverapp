<template>
  <panel-view />
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "panel-view": () => import("@/components/mobile/panel-view.vue")
  }
})
export default class AuthScreen extends Vue {}
</script>
