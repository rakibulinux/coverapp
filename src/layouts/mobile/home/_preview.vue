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
export default {
  data: () => ({
    swiperOption: {
      loop: true,
      spaceBetween: 0,
      centeredSlides: true,
      autoplay: {
        delay: 15000,
        disableOnInteraction: false
      }
    }
  })
};
</script>
