<template>
  <div class="advantages">
    <div class="title" v-text="title" />
    <ul class="about-content">
      <li v-for="(data, index) in contentOne" :key="index">
        <img :src="data.img" />
        <div>
          <div class="title" v-text="data.title" />
          <div class="desc" v-text="data.desc" />
        </div>
      </li>
    </ul>
    <ul class="about-content">
      <li v-for="(data, index) in contentTwo" :key="index">
        <img :src="data.img" />
        <div>
          <div class="title" v-text="data.title" />
          <div class="desc" v-text="data.desc" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import config from "@/config";
import advantage_example from "@/assets/img/advantage_example.png";

export default {
  data: () => ({
    title: "The Advantages of XUM Exchange",
    contentOne: [
      {
        img: advantage_example,
        title: "Secure & Reliable",
        desc:
          "Your digital assets are secured safely with highest levels of SSL encryption security."
      },
      {
        img: advantage_example,
        title: "Professional Team",
        desc:
          "Our team is composed of finance and IT experts with years of trading experiences."
      },
      {
        img: advantage_example,
        title: "Risk Management",
        desc:
          "Our dedicated risk management team manages the safety of your digital assets with multi-dimension security protection system."
      }
    ],
    contentTwo: [
      {
        img: advantage_example,
        title: "Superior Technology",
        desc:
          "Enjoy stable and fast trading experience with highly-efficient matching engine in our clean and simple UI."
      },
      {
        img: advantage_example,
        title: "Full Liquidity",
        desc:
          "Enjoy fast and efficient Fiat-Crypto and Crypto-Crypto trading experience with our excellent liquidity of cryptocurrencies."
      },
      {
        img: advantage_example,
        title: "Global Resources",
        desc:
          "Connecting outstanding blockchain projects from all of the world to you."
      }
    ]
  })
};
</script>
