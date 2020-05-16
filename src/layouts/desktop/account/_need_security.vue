<template>
  <div>
    <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
    <div class="title">Security alert</div>
    <div class="desc">
      Select an authentication method from the list below for your account’s
      safety.
    </div>
    <div class="box">
      <p
        v-for="(data, index) in actions"
        :key="index"
        @click="actionChange(index)"
      >
        <img :src="data.logo" class="icon" />
        <span class="name">{{ data.name }}</span>
        <span class="action" :class="{ selected: selected === index }" />
      </p>
    </div>
    <button
      type="submit"
      :disabled="!selected"
      @click="$emit('changeModal', selected)"
    >
      Next
    </button>
    <div class="later-footer">
      <span @click="closeModal">Maybe later</span>
    </div>
  </div>
</template>

<script>
import example_action_logo from "@/assets/img/example_modal_logo.jpg";

export default {
  data: () => ({
    actions: {
      "2fa": {
        enabled: false,
        logo: example_action_logo,
        name: "Google Authenticator"
      }
    },
    selected: ""
  }),
  methods: {
    actionChange(action) {
      this.selected = action;
    },
    closeModal() {
      this.$emit("closeModal");
    }
  }
};
</script>
