<template>
  <q-card class="my-card" flat :class="{ 'card-hover': true }">
    <div class="image-container">
      <img :src="productImage" :alt="product.name" />
    </div>

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
.my-card {
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
}

/* Контейнер для изображения */
.image-container {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  overflow: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain; /* ← ВАЖНО: изображение полностью помещается в контейнер */
  display: block;
  transition: transform 0.5s ease;
}

/* Альтернатива: object-fit: scale-down (автоматически выбирает между contain и none) */
/* img {
  max-width: 100%;
  max-height: 100%;
  object-fit: scale-down;
} */

.card-hover:hover img {
  transform: scale(1.05);
}

.operText {
  background-clip: text;
  background-image: linear-gradient(225deg, rgb(241, 17, 126) 0%, rgb(241, 17, 126) 100%);
  color: transparent;
}

.text-h6 {
  color: #343a40;
  margin-bottom: 8px;
  min-height: 3em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  color: #007bff;
}

/* Обеспечиваем что секция контента занимает оставшееся пространство */
.q-card__section {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>