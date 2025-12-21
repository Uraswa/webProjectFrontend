<template>
  <div class="row items-center header">
    <div class="col-1">
      <router-link to="/" style="text-decoration: none; color: inherit;">
        <p style="margin: 0; font-size: 2em">Sellzy</p>
      </router-link>
    </div>

    <div class="col-2" style="display: flex; justify-content: space-around">
      <q-btn 
        icon="menu" 
        label="Каталог" 
        :to="{ name: 'catalog' }" 
      />
    </div>

    <!-- 🔽 ПОИСК -->
    <div class="col-6">
      <ProductSearchInput />
    </div>

    <div class="col-3" style="display:flex; justify-content: center; align-items: center; gap: 16px;">
      <!-- Кнопка корзины с бейджиком -->
      <q-btn round flat icon="shopping_basket" :to="{ name: 'cart' }">
        <q-badge v-if="itemCount > 0" color="red" floating rounded>
          {{ itemCount }}
        </q-badge>
        <q-tooltip>Корзина</q-tooltip>
      </q-btn>
      
      <!-- Кнопка ЛК -->
      <q-btn round flat icon="account_circle" :to="{ name: 'orders' }">
        <q-tooltip>Мои заказы</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ProductSearchInput from 'src/features/productSearch/ui/productSearchInput.vue';
import { useCartStore } from 'src/shared/store/cartStore';

const cartStore = useCartStore();

// Получаем количество товаров из глобального store
const itemCount = computed(() => cartStore.itemCount.value);

// Загружаем информацию о корзине при монтировании Header
onMounted(() => {
  cartStore.fetchCartInfo();
});
</script>

<style scoped>
.header {
  padding: 10px 0;
  background-color: white;
}
</style>