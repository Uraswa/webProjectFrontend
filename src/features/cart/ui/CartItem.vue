<template>
  <q-item class="q-pa-none cart-item">
    <q-item-section avatar class="cart-item-checkbox">
      <q-checkbox 
        :model-value="selected" 
        @update:model-value="$emit('toggle-select')" 
      />
    </q-item-section>

    <q-item-section avatar class="cart-item-image">
      <router-link :to="`/product/${item.product_id}`" style="text-decoration: none;">
        <q-img
          :src="item.image"
          width="80px"
          height="80px"
          class="rounded-borders cart-image"
          :ratio="1"
        />
      </router-link>
    </q-item-section>

    <q-item-section class="cart-item-info">
      <router-link :to="`/product/${item.product_id}`" style="text-decoration: none; color: inherit;">
        <q-item-label class="text-weight-medium cursor-pointer cart-item-name">
          {{ item.name }}
        </q-item-label>
      </router-link>
      <q-item-label caption lines="2" class="cart-item-description">{{ item.description }}</q-item-label>
      <q-item-label caption class="text-grey-6 cart-item-shop">
        Магазин: {{ item.product.shop_name }}
      </q-item-label>
      
      <!-- Мобильная версия: цена и кнопки +/- -->
      <div class="cart-item-mobile-controls">
        <div class="row items-center justify-between q-mt-sm">
          <div class="column">
            <div class="text-h6 text-weight-bold text-primary cart-item-price-mobile">
              {{ (item.price * item.quantity).toFixed(2) }}₽
            </div>
            <div class="text-caption text-grey-7 cart-item-price-per-item">
              {{ item.price.toFixed(2) }}₽ × {{ item.quantity }} шт.
            </div>
          </div>
          
          <div class="row items-center q-gutter-sm">
            <q-btn
              round
              dense
              flat
              icon="remove"
              size="sm"
              :disable="item.quantity <= 1 || loading"
              @click="$emit('decrease')"
              class="cart-item-quantity-btn"
            />
            <div class="text-weight-medium cart-item-quantity">{{ item.quantity }} шт.</div>
            <q-btn
              round
              dense
              flat
              icon="add"
              size="sm"
              :disable="loading"
              @click="$emit('increase')"
              class="cart-item-quantity-btn"
            />
          </div>
        </div>
      </div>
    </q-item-section>

    <!-- Десктопная версия: цена -->
    <q-item-section side class="cart-item-price-desktop">
      <div class="column items-end q-gutter-y-xs">
        <div class="text-h6 text-weight-bold text-primary cart-item-total">
          {{ (item.price * item.quantity).toFixed(2) }}₽
        </div>
        <div class="text-caption text-grey-7 cart-item-details">
          {{ item.price.toFixed(2) }}₽ × {{ item.quantity }} шт.
        </div>
      </div>
    </q-item-section>

    <!-- Десктопная версия: кнопки +/- -->
    <q-item-section side class="cart-item-quantity-desktop">
      <div class="column items-center q-gutter-y-xs">
        <q-btn
          round
          dense
          flat
          icon="remove"
          size="sm"
          :disable="item.quantity <= 1 || loading"
          @click="$emit('decrease')"
        />
        <div class="text-weight-medium">{{ item.quantity }} шт.</div>
        <q-btn
          round
          dense
          flat
          icon="add"
          size="sm"
          :disable="loading"
          @click="$emit('increase')"
        />
      </div>
    </q-item-section>

    <!-- Кнопка удаления -->
    <q-item-section side class="cart-item-delete">
      <q-btn
        flat
        round
        dense
        color="grey"
        icon="delete"
        :disable="loading"
        @click="$emit('remove')"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    id: number;
    product_id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    product: any;
  };
  selected: boolean;
  loading: boolean;
}>();

defineEmits<{
  'toggle-select': [];
  'increase': [];
  'decrease': [];
  'remove': [];
}>();
</script>

<style scoped>
/* Базовые стили */
.cart-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
  align-items: stretch;
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  text-decoration: underline;
}

/* Десктопные элементы (по умолчанию видны) */
.cart-item-price-desktop,
.cart-item-quantity-desktop,
.cart-item-delete {
  display: flex;
}

/* Мобильные элементы (по умолчанию скрыты) */
.cart-item-mobile-controls {
  display: none;
}

/* Адаптивность изображения */
.cart-image {
  transition: all 0.3s ease;
}

/* ===== АДАПТИВНОСТЬ ===== */

/* Планшеты (768px-991px) - небольшие корректировки */
@media (max-width: 991px) {
  .cart-image {
    width: 70px !important;
    height: 70px !important;
  }
  
  .cart-item-name {
    font-size: 0.95rem;
    line-height: 1.3;
  }
  
  .cart-item-description {
    font-size: 0.85rem;
    line-height: 1.2;
  }
  
  .cart-item-shop {
    font-size: 0.8rem;
  }
  
  .cart-item-total {
    font-size: 1rem;
  }
  
  .cart-item-details {
    font-size: 0.8rem;
  }
}

/* Мобильные (<768px) */
@media (max-width: 767px) {
  .cart-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    margin-bottom: 12px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  
  .cart-item:last-child {
    margin-bottom: 0;
  }
  
  /* Первая строка: чекбокс, фото, название, удаление */
  .cart-item-checkbox,
  .cart-item-image,
  .cart-item-delete {
    position: absolute;
    top: 16px;
  }
  
  .cart-item-checkbox {
    left: 16px;
  }
  
  .cart-item-image {
    left: 56px;
  }
  
  .cart-item-delete {
    right: 16px;
    top: 28px;
  }
  
  .cart-image {
    width: 60px !important;
    height: 60px !important;
  }
  
  /* Информация о товаре */
  .cart-item-info {
    width: 100%;
    margin-top: 70px;
    margin-left: 0;
    padding-left: 0;
  }
  
  .cart-item-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 4px;
    padding-right: 40px; /* Для кнопки удаления */
  }
  
  .cart-item-description {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .cart-item-shop {
    font-size: 0.85rem;
    margin-bottom: 12px;
  }
  
  /* Скрываем десктопные элементы */
  .cart-item-price-desktop,
  .cart-item-quantity-desktop {
    display: none !important;
  }
  
  /* Показываем мобильные элементы */
  .cart-item-mobile-controls {
    display: block;
    width: 100%;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }
  
  .cart-item-price-mobile {
    font-size: 1.1rem;
  }
  
  .cart-item-price-per-item {
    font-size: 0.85rem;
    margin-top: 2px;
  }
  
  .cart-item-quantity {
    font-size: 0.95rem;
    min-width: 40px;
    text-align: center;
  }
  
  .cart-item-quantity-btn {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
  }
}

/* Очень маленькие экраны (<480px) */
@media (max-width: 480px) {
  .cart-item {
    padding: 12px;
  }
  
  .cart-item-checkbox {
    left: 12px;
  }
  
  .cart-item-image {
    left: 50px;
  }
  
  .cart-item-delete {
    right: 12px;
    top: 24px;
  }
  
  .cart-image {
    width: 50px !important;
    height: 50px !important;
  }
  
  .cart-item-info {
    margin-top: 60px;
  }
  
  .cart-item-name {
    font-size: 0.95rem;
    padding-right: 35px;
  }
  
  .cart-item-description {
    font-size: 0.85rem;
  }
  
  .cart-item-shop {
    font-size: 0.8rem;
  }
  
  .cart-item-price-mobile {
    font-size: 1rem;
  }
  
  .cart-item-quantity {
    font-size: 0.9rem;
    min-width: 35px;
  }
  
  .cart-item-quantity-btn {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
  }
}

/* Горизонтальные телефоны (высота ≤600px) */
@media (max-height: 600px) and (orientation: landscape) {
  .cart-item {
    flex-direction: row;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
  }
  
  .cart-item-checkbox,
  .cart-item-image,
  .cart-item-delete {
    position: static;
  }
  
  .cart-item-info {
    margin-top: 0;
    margin-left: 12px;
    flex: 1;
  }
  
  .cart-item-mobile-controls {
    display: none;
  }
  
  .cart-item-price-desktop,
  .cart-item-quantity-desktop {
    display: flex !important;
  }
  
  .cart-item-price-desktop {
    min-width: 100px;
  }
  
  .cart-item-quantity-desktop {
    min-width: 60px;
  }
}
</style>