<template>
  <q-page class="q-pa-lg">
    <!-- Хлебные крошки -->
    <q-breadcrumbs class="q-mb-xl">
      <q-breadcrumbs-el label="Главная" icon="home" to="/" />
      <q-breadcrumbs-el label="Корзина" />
    </q-breadcrumbs>

    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-gears size="50px" color="primary" />
      <div class="q-mt-md">Загрузка корзины...</div>
    </div>

    <div v-else-if="error" class="text-center q-py-xl">
      <q-icon name="error" size="50px" color="negative" />
      <div class="text-h6 q-mt-md">Ошибка загрузки корзины</div>
      <div class="q-mt-sm">{{ error }}</div>
      <q-btn label="Повторить" color="primary" @click="fetchCart" class="q-mt-md" />
    </div>

    <div v-else>
      <div class="text-h4 text-weight-bold q-mb-lg">Корзина</div>

      <div v-if="cartItems.length === 0" class="text-center q-py-xl">
        <q-icon name="shopping_cart" size="100px" color="grey-5" />
        <div class="text-h5 text-weight-medium q-mt-md text-grey-7">Ваша корзина пуста</div>
        <div class="text-grey-6 q-mt-sm">Добавьте товары из каталога</div>
        <q-btn label="Перейти в каталог" color="primary" to="/catalog" class="q-mt-lg" />
      </div>

      <div v-else class="row q-col-gutter-xl">
        <!-- Левая колонка - товары -->
        <div class="col-md-8 col-12">
          <q-card flat bordered>
            <q-card-section>
              <!-- Шапка с выбором всех -->
              <div class="row items-center q-mb-md">
                <q-checkbox
                  v-model="selectAll"
                  label="Выбрать все"
                  class="text-weight-medium"
                />
                <q-space />
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="delete"
                  label="Удалить выбранные"
                  @click="removeSelectedItems"
                  v-if="selectedItems.length > 0"
                  :loading="loading"
                />
              </div>

              <q-separator class="q-mb-md" />

              <!-- Список товаров -->
              <div class="column q-gutter-y-lg">
                <CartItem
                  v-for="item in cartItems"
                  :key="item.id"
                  :item="item"
                  :selected="selectedItems.includes(item.id)"
                  @toggle-select="toggleItemSelect(item.id)"
                  @increase="increaseQuantity(item.id)"
                  @decrease="decreaseQuantity(item.id)"
                  @remove="removeItem(item.id)"
                  :loading="loading"
                />
              </div>
            </q-card-section>
          </q-card>

        </div>

        <!-- Правая колонка - итоги -->
        <div class="col-md-4 col-12" :class="$q.screen.lt.md ? 'order-first' : ''">
          <CartSummary
            :selected-items-count="selectedItemsCount"
            :total-price="totalPrice"
            :delivery-price="deliveryPrice"
            :total-with-delivery="totalWithDelivery"
            :cart-item-count="cart?.item_count || 0"
            :cart-total="cart?.total || '0'"
            :disabled="selectedItemsCount === 0"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useCartPage } from './model/useCartPage';
import CartItem from 'src/features/cart/ui/CartItem.vue';
import CartSummary from 'src/features/cart/ui/CartSummary.vue';

const {
  cart,
  cartItems,
  loading,
  error,
  selectedItems,
  selectAll,
  selectedItemsCount,
  totalPrice,
  deliveryPrice,
  totalWithDelivery,
  fetchCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart, // Оставляем функцию, но не используем в шаблоне
  removeSelectedItems
} = useCartPage();

function toggleItemSelect(productId: number) {
  const index = selectedItems.value.indexOf(productId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(productId);
  }
}
</script>