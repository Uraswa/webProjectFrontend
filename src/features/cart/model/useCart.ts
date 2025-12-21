import { ref, computed } from 'vue';
import { cartApi } from '../api/cartApi';
import { Cart, CartInfo } from '../types';

export function useCart() {
  const cart = ref<Cart | null>(null);
  const cartInfo = ref<CartInfo | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const itemCount = computed(() => cartInfo.value?.item_count || 0);
  const totalPrice = computed(() => cart.value?.total || '0');
  const hasCart = computed(() => cartInfo.value?.exists || false);

  async function fetchCart() {
    try {
      loading.value = true;
      error.value = null;
      cart.value = await cartApi.getCart();
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Ошибка при загрузке корзины';
      console.error('Ошибка загрузки корзины:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCartInfo() {
    try {
      cartInfo.value = await cartApi.getCartInfo();
    } catch (err: any) {
      console.error('Ошибка загрузки информации о корзине:', err);
    }
  }

  async function updateCartItem(productId: number, quantity: number) {
    try {
      loading.value = true;
      cart.value = await cartApi.updateCartItem(productId, quantity);
      await fetchCartInfo(); // Обновляем быструю информацию
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Ошибка при обновлении корзины';
      console.error('Ошибка обновления корзины:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function clearCart() {
    try {
      loading.value = true;
      await cartApi.clearCart();
      cart.value = {
        items: [],
        total: "0",
        item_count: 0
      };
      cartInfo.value = {
        item_count: 0,
        total_items: 0,
        exists: false,
        updated_at: new Date().toISOString()
      };
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Ошибка при очистке корзины';
      console.error('Ошибка очистки корзины:', err);
    } finally {
      loading.value = false;
    }
  }

  return {
    cart,
    cartInfo,
    loading,
    error,
    itemCount,
    totalPrice,
    hasCart,
    fetchCart,
    fetchCartInfo,
    updateCartItem,
    clearCart
  };
}