<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCartStore } from './shared/store/cartStore';

const cartStore = useCartStore();

onMounted(() => {
  cartStore.fetchCartInfo();
});
</script>