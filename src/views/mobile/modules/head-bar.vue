<template>
  <action-bar
    class="head-bar"
    :left-disabled="leftDisabled"
    :transparent="transparent"
    @on-back="$emit('remove')"
  >
    <div class="center-action">
      <span v-if="loading" class="title loading">
        Loading <a-icon type="loading" />
      </span>
      <span v-else class="title">{{ title }}</span>
    </div>
    <slot name="right" />
  </action-bar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "action-bar": () => import("@/components/mobile/action-bar.vue")
  }
})
export default class ActionBar extends Vue {
  @Prop() readonly title!: string;
  @Prop() readonly loading!: boolean;
  @Prop() readonly leftDisabled!: boolean;
  @Prop() readonly transparent!: boolean;
}
</script>
