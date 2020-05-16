<template>
  <div class="ant-layout-tab-bar">
    <router-link
      v-for="(data, index) in TAB"
      :key="index"
      :to="data.url"
      class="item"
    >
      <div>
        <div class="icon"><i :class="data.icon" /></div>
        <span class="text">{{ data.text }}</span>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data: () => ({
    selected: "",
    TAB: [
      {
        text: "Home",
        icon: "cubeic-home",
        url: "/m"
      },
      {
        text: "Markets",
        icon: "cubeic-home",
        url: "/m/markets"
      },
      {
        text: "Trades",
        icon: "cubeic-like",
        url: "/m/exchange"
      },
      {
        text: "Assets",
        icon: "ic-qianbao",
        url: "/m/assets"
      },
      {
        text: "Personal",
        icon: "ic-personal",
        url: "/m/personal"
      }
    ]
  }),
  computed: {
    path() {
      return this.$store.state.public.path;
    }
  },
  methods: {
    changeSelected(path) {
      this.selected = path;
    }
  },
  mounted() {
    this.changeSelected(this.path);
  },
  watch: {}
};
</script>
