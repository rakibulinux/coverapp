<template>
  <div class="modal-exchange" :class="background">
    <div>
      <router-link
        v-for="(data, index) in BUTTON"
        :key="index"
        class="ant-btn ant-btn-primary"
        tag="button"
        :to="data.url"
        v-text="$t(data.name)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    background: String
  },
  data: () => ({
    BUTTON: [
      { name: "header.login", url: "/signin" },
      { name: "header.register", url: "/signup" }
    ]
  })
};
</script>
