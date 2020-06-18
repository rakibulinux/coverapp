<template>
  <div class="preview">
    <div class="fixed">
      <h3>[NAME] - Your Great Choice</h3>
      <div ref="banner" class="banner">
        <swiper class="slide_viewer" :options="swiperOption">
          <swiper-slide v-for="(data, i) in banners" :key="i" class="slide">
            <a
              v-for="(dataV, index) in data"
              :key="index"
              target="_blank"
              :href="dataV.link"
            >
              <img :src="dataV.img" />
            </a>
          </swiper-slide>
          <div slot="pagination" class="swiper-pagination" />
        </swiper>
      </div>
    </div>
    <canvas ref="canvas" />
    <div class="news" />
  </div>
</template>

<script>
import config from "@/config";
import { canvas } from "@/assets/js";

export default {
  data: () => ({
    swiperOption: {
      slidesPerView: 1,
      loop: true,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      }
    }
  }),
  computed: {
    banners() {
      return config.banners;
    }
  },
  mounted() {
    canvas(this.$refs["canvas"]);
  }
};
</script>
