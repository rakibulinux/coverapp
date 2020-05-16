<template>
  <div class="more-market">
    <span @click="SwitchToMarkets">
      More
      <span>
        <i class="ic-arrow-down" />
        <i class="ic-arrow-down" />
      </span>
    </span>
  </div>
</template>

<script>
export default {
  methods: {
    SwitchToMarkets() {
      this.$router.push("/m/markets");
    }
  }
};
</script>