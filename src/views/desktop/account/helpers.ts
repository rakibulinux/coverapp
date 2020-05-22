export default {
  mounted() {},
  methods: {
    onClick(runner) {
      this.$refs[runner].create();
    },
  },
};
