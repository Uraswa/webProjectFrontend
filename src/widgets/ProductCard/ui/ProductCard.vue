<template>
  <q-card class="my-card" flat>
    <img :src="productImage" :alt="product.name" />

    <q-card-section>
      <RouterLink :to="`/product/${product.product_id}`">
        <div class="text-h6">{{ product.name }}</div>
      </RouterLink>
      <div class="text-h6" style="font-weight: bold">
        <span style="font-size: 20px" class="operText">{{ product.price }}₽</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Product } from 'entities/Product/models/Product'

export default defineComponent({
  name: 'ProductCard',
  
  props: {
    product: {
      type: Object as () => Product,
      required: true,
    },
  },

  computed: {
    productImage(): string {
      if (Array.isArray(this.product.photos) && this.product.photos.length > 0) {
        return this.product.photos[0]
      }
      
      if (typeof this.product.photos === 'string') {
        try {
          let photosStr = this.product.photos.trim()
          if (photosStr.startsWith("'") && photosStr.endsWith("'")) {
            photosStr = photosStr.slice(1, -1)
          }
          const photos = JSON.parse(photosStr)
          if (Array.isArray(photos) && photos.length > 0) {
            return photos[0]
          }
        } catch (e) {
          console.warn('Failed to parse photos:', e)
        }
      }
      
      return '/placeholder.png'
    }
  }
})
</script>

<style scoped>
.operText {
  background-clip: text;
  background-image: linear-gradient(225deg, rgb(241, 17, 126) 0%, rgb(241, 17, 126) 100%);
  color: transparent;
}
</style>