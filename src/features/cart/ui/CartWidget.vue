<template>
  <q-btn flat round dense icon="shopping_cart" :to="{ name: 'cart' }">
    <q-badge v-if="itemCount > 0" color="red" floating>
      {{ itemCount }}
    </q-badge>
    <q-tooltip>Корзина ({{ itemCount }} {{ getRussianPlural(itemCount, 'товар', 'товара', 'товаров') }})</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCart } from '../model/useCart';

const { cartInfo } = useCart();
const itemCount = computed(() => cartInfo.value?.item_count || 0);

function getRussianPlural(number: number, one: string, two: string, five: string): string {
  const n = Math.abs(number) % 100;
  const n1 = n % 10;
  
  if (n > 10 && n < 20) return five;
  if (n1 > 1 && n1 < 5) return two;
  if (n1 === 1) return one;
  return five;
}
</script>