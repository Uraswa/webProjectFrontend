<!-- features/ProductCard/ui/ProductCard.vue -->
<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { Product } from 'entities/Product/models/Product'

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object as () => Product,
      required: true,
    },
  },
  setup(props) {
    const placeholder = '/path/to/placeholder.png' // поменяй на реальный путь

    const firstPhoto = computed(() => {
      try {
        const photos = JSON.parse(props.product.photos)
        if (Array.isArray(photos) && photos.length > 0) {
          return photos[0]
        }
        return placeholder
      } catch (e) {
        return placeholder
      }
    })

    return {
      firstPhoto,
    }
  },
})
</script>

<template>
  <q-card class="my-card" flat>
    <img :src="firstPhoto" alt="Product image" />

    <q-card-section>
      <RouterLink :to="`/product/`">
        <div class="text-h6">{{ product.name }}</div>
      </RouterLink>
      <div class="text-h6" style="font-weight: bold">
        <span style="font-size: 20px" class="operText">{{ product.price }}₽</span>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div style="display: flex; justify-content: space-between">
        <div style="color: rgba(153, 163, 174);">
          {{ product.order_count }} заказов
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.operText {
  background-clip: text;
  background-image: linear-gradient(225deg, rgb(241, 17, 126) 0%, rgb(241, 17, 126) 100%);
  color: transparent;
}
</style>