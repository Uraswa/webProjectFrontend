<!-- widgets/ProductGallery/ui/ProductGallery.vue -->
<template>
  <div>
    <div v-if="images.length > 0">
      <q-card flat bordered class="q-mb-sm">
        <q-carousel
          v-model="currentSlide"
          animated
          infinite
          arrows
          height="400px"
          class="rounded-borders"
          control-color="primary"
        >
          <q-carousel-slide
            v-for="(image, index) in images"
            :key="index"
            :name="index"
            class="flex flex-center bg-grey-1"
          >
            <q-img
              :src="image"
              :ratio="1"
              width="100%"
              height="100%"
              class="fit"
              fit="contain"
              :alt="`Фото товара ${index + 1}`"
              loading="lazy"
            />
          </q-carousel-slide>
        </q-carousel>
      </q-card>

      <div class="row q-col-gutter-xs justify-center">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="col-auto"
        >
          <q-card
            flat
            bordered
            class="cursor-pointer thumb-card"
            :class="{ 'thumb-active': currentSlide === index }"
            @click="currentSlide = index"
            style="width: 80px; height: 80px;"
          >
            <q-img
              :src="image"
              ratio="1"
              width="100%"
              height="100%"
              class="rounded-borders"
              fit="cover"
            />
          </q-card>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center q-pa-xl">
      <q-icon name="photo" size="4em" color="grey-4" class="q-mb-md" />
      <div class="text-grey-7">Нет фотографий товара</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'ProductGallery',
  props: {
    images: {
      type: Array as PropType<string[]>,
      required: true
    }
  },
  setup() {
    const currentSlide = ref(0)
    return { currentSlide }
  }
})
</script>

<style scoped>
.thumb-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}
.thumb-card:hover {
  border-color: #1976d2;
}
.thumb-active {
  border-color: #1976d2 !important;
}
</style>