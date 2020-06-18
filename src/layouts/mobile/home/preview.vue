<template>
  <swiper class="preview" :options="swiperOption">
    <swiper-slide>
      <img src="@/assets/img/banner_home.png" />
    </swiper-slide>
    <swiper-slide>
      <img src="@/assets/img/banner_home.png" />
    </swiper-slide>
    <swiper-slide>
      <img src="@/assets/img/banner_home.png" />
    </swiper-slide>
    <swiper-slide>
      <img src="@/assets/img/banner_home.png" />
    </swiper-slide>
  </swiper>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Preview extends Vue {
  swiperOption = {
    loop: true,
    spaceBetween: 0,
    centeredSlides: true,
    autoplay: {
      delay: 15000,
      disableOnInteraction: false
    }
  };
}
</script>
