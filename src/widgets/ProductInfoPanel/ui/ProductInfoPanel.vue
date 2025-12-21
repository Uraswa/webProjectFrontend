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

      <!-- Кнопка добавления в корзину -->
      <q-btn
        label="Добавить в корзину"
        color="primary"
        size="lg"
        icon="shopping_cart"
        class="full-width q-mb-md"
        @click="addToCart"
        :loading="loading"
        unelevated
      />

      <!-- Простое уведомление -->
      <div v-if="showNotification" class="q-pa-sm q-mb-md text-center" style="background-color: #4caf50; color: white; border-radius: 4px;">
        <q-icon name="check_circle" class="q-mr-sm" />
        Товар добавлен в корзину!
      </div>

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

<script setup lang="ts">
import { ref } from 'vue';
import { useCart } from 'src/features/cart/model/useCart';

const props = defineProps<{
  product: {
    product_id: number;
    name: string;
    description: string;
    price: string;
    category_name?: string;
    shop_name?: string;
  };
  rating: {
    total_reviews: string;
    average_rating: string;
  };
}>();

const emit = defineEmits<{
  'buy-now': [];
}>();

const { updateCartItem } = useCart();
const loading = ref(false);
const showNotification = ref(false);
let notificationTimeout: NodeJS.Timeout | null = null;

async function addToCart() {
  try {
    loading.value = true;
    showNotification.value = false;
    
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
    
    await updateCartItem(props.product.product_id, 1);
    
    // Показываем свое уведомление
    showNotification.value = true;
    
    // Скрываем через 3 секунды
    notificationTimeout = setTimeout(() => {
      showNotification.value = false;
    }, 3000);
    
  } catch (error) {
    console.error('❌ Ошибка добавления в корзину:', error);
    
    // Можно показать ошибку
    showNotification.value = true;
    // Или сделать отдельное уведомление об ошибке
    
  } finally {
    loading.value = false;
  }
}

function getReviewCountText(count: number): string {
  if (typeof count !== 'number' || isNaN(count) || count < 0) {
    return '0 отзывов';
  }
  
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} отзывов`;
  }
  
  switch (lastDigit) {
    case 1:
      return `${count} отзыв`;
    case 2:
    case 3:
    case 4:
      return `${count} отзыва`;
    default:
      return `${count} отзывов`;
  }
}
</script>