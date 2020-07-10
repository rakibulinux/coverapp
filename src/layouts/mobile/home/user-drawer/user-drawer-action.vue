<template>
  <div class="user-drawer-action">
    <div class="user-drawer-action-item">
      <span>
        <a-icon theme="filled" type="setting" />
      </span>
      <span>Settings</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class UserDrawerAction extends Vue {}
</script>
