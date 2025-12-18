<!-- features/ProductCard/ui/ProductCard.vue -->
<script setup lang="ts">
import type { Product } from 'entities/Product/models/Product'

defineProps<{ product: Product }>()
</script>

<template>
  <q-card class="my-card" flat>

    <img :src="product.imageUrl" alt="Product image" />

    <q-card-section>
      <!-- <RouterLink :to="`/product/${product.id}`"> -->
      <RouterLink :to="`/product/`">
        <div class="text-h6">{{ product.title }}</div>
      </RouterLink>
      <div class="text-h6" style="font-weight: bold">
        <span style="font-size: 20px" class="operText">{{ product.price }}₽</span>
      </div>
      <div>
        <span class="prevPrice">{{ product.prevPrice }}₽</span>
        <span class="bargainText">-{{ product.discount }}%</span>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div style="display: flex; justify-content: space-between">
        <div>
          <q-icon
            v-for="i in 5"
            :key="i"
            name="star"
            color="orange"
            size="sm"
          />
        </div>
        <div style="color: rgba(153, 163, 174);">
          {{ product.reviewsCount }} отзывов
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
.prevPrice {
  color: rgba(153, 163, 174);
  text-decoration: line-through;
  font-size: 14px;
}
.bargainText {
  color: rgba(241, 17, 126, 1);
  font-size: 14px;
  margin-left: 4px;
}
</style>
