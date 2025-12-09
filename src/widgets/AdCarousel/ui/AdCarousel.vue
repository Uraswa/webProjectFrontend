<template>
  <q-carousel
    animated
    v-model="slide"
    arrows
    navigation
    infinite
    :autoplay="3000"
    style="height: 250px;"
  >
    <q-carousel-slide :name="1">
      <img src="public/ad1.png" class="ad-img">
    </q-carousel-slide>

    <q-carousel-slide :name="2">
      <img src="public/ad2.png" class="ad-img">
    </q-carousel-slide>

    <q-carousel-slide :name="3">
      <img src="public/ad3.png" class="ad-img">
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
export default {
  name: 'AdCarousel',
  data() {
    return {
      slide: 1
    }
  }
}
</script>

<style scoped>
.ad-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>