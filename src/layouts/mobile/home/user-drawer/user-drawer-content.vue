<template>
  <div class="user-drawer-content">
    <setting-row :data="{ icon: 'message', text: 'Support' }" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "setting-row": () => import("@/components/mobile/setting-row")
  }
})
export default class UserDrawerContent extends Vue {}
</script>
