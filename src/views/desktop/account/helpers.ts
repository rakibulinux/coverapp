export default {
  methods: {
    onClick(runner) {
      this.$refs[runner].create();
    },
  },
};
