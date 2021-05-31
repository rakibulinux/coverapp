<template>
  <div class="preview">
    <div class="fixed">
      <h3>Welcome to Smart Chainers exchange</h3>
      <div class="banners">
        <swiper class="slide_viewer" :options="swiperOption">
          <swiper-slide v-for="(banner, index) in banners" :key="index">
            <a
              target="_blank"
              :href="banner.url"
            >
              <img :src="banner.image" />
            </a>
          </swiper-slide>
          <div slot="pagination" class="swiper-pagination" />
        </swiper>
      </div>
    </div>
    <canvas ref="canvas" />
    <broadcasts />
  </div>
</template>

<script lang="ts">
// import config from "@/config";
import { canvas } from "@/assets/js";
import { Vue, Component } from "vue-property-decorator";
// import { PublicController } from "@/controllers";
import Banner1 from "@/assets/img/banner/banner_1.png"
import Banner2 from "@/assets/img/banner/banner_2.png"
import Banner3 from "@/assets/img/banner/banner_3.png"
import Banner4 from "@/assets/img/banner/banner_4.png"

@Component({
  components: {
    broadcasts: () => import("./broadcasts.vue")
  }
})
export default class Preview extends Vue {
  swiperOption = {
    slidesPerView: 4,
    spaceBetween: 24,
    freeMode: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    }
  }

  get banners() {
    const data = [
      {
        uuid:"banner-1",             
        url:"https://newexch.xumchain.com/",
        image:Banner1
      },
      {
        uuid:"banner-2",             
        url:"https://newexch.xumchain.com/",
        image:Banner2
      },
      {
        uuid:"banner-3",             
        url:"https://newexch.xumchain.com/",
        image:Banner3
      },
      {
        uuid:"banner-4",             
        url:"https://newexch.xumchain.com/",
        image:Banner4
      }
    ]
    return data;
  }

  mounted() {
    this.draw_canvas();

    window.addEventListener("resize", this.draw_canvas);
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.draw_canvas);
  }

  draw_canvas() {
    canvas(this.$refs["canvas"]);
  }
};
</script>
