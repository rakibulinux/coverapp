export default {
  mounted() {},
  methods: {
    onClick(runner) {
      for (var i in this.$refs) {
        this.$refs[i].remove();
      }
      this.$refs[runner].render();
    }
  }
};
