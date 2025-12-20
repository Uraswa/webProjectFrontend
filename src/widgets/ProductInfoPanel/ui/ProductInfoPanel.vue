<!-- widgets/ProductInfoPanel/ui/ProductInfoPanel.vue -->
<template>
  <div class="column justify-between" style="height: 100%">
    <div>
      <h4 class="q-mt-none q-mb-md text-weight-bold">{{ product.name }}</h4>
      <p class="text-grey-7 q-mb-lg" style="white-space: pre-line">{{ product.description }}</p>

      <q-list bordered class="rounded-borders q-mb-lg">
        <q-item v-if="product.category_name">
          <q-item-section>
            <q-item-label caption>Категория</q-item-label>
            <q-item-label>{{ product.category_name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="product.shop_name">
          <q-item-section>
            <q-item-label caption>Магазин</q-item-label>
            <q-item-label>{{ product.shop_name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Рейтинг</q-item-label>
            <div class="row items-center">
              <q-rating
                :model-value="parseFloat(rating.average_rating)"
                size="1.5em"
                color="orange"
                readonly
                class="q-mr-sm"
              />
              <span class="text-caption text-grey-7">
                {{ getReviewCountText(parseInt(rating.total_reviews) || 0) }}
              </span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div>
      <div class="row items-center q-mb-sm">
        <span class="text-h4 text-weight-bold text-primary q-mr-md">{{ product.price }}₽</span>
      </div>

      <q-btn
        label="Добавить в корзину"
        color="primary"
        size="lg"
        icon="shopping_cart"
        class="full-width q-mb-md"
        @click="$emit('add-to-cart')"
        unelevated
      />

      <q-btn
        label="Купить в 1 клик"
        color="deep-orange"
        outline
        class="full-width"
        @click="$emit('buy-now')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { Product } from 'entities/Product/models/Product'

export default defineComponent({
  name: 'ProductInfoPanel',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    rating: {
      type: Object as PropType<{ total_reviews: string; average_rating: string }>,
      required: true
    }
  },
  emits: ['add-to-cart', 'buy-now'],
  
  methods: {
    getReviewCountText(count: number): string {
      if (typeof count !== 'number' || isNaN(count) || count < 0) {
        return '0 отзывов'
      }
      
      const lastDigit = count % 10
      const lastTwoDigits = count % 100
      
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return `${count} отзывов`
      }
      
      switch (lastDigit) {
        case 1:
          return `${count} отзыв`
        case 2:
        case 3:
        case 4:
          return `${count} отзыва`
        default:
          return `${count} отзывов`
      }
    }
  }
}) 
</script>