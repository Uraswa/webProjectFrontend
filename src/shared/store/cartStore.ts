import { ref } from 'vue';
import Api from 'src/shared/api/Api';

// Простой реактивный store для количества товаров в корзине
const itemCount = ref(0);
const loading = ref(false);

export function useCartStore() {
  const setItemCount = (count: number) => {
    itemCount.value = count;
  };

  const getItemCount = () => {
    return itemCount.value;
  };

  const increment = () => {
    itemCount.value += 1;
  };

  const decrement = () => {
    if (itemCount.value > 0) {
      itemCount.value -= 1;
    }
  };

  // Функция для загрузки информации о корзине с сервера
  const fetchCartInfo = async () => {
    try {
      loading.value = true;
      const response = await Api.get('/api/cart/info');
      if (response.data.success) {
        itemCount.value = response.data.data.item_count || 0;
      }
    } catch (error) {
      console.error('Error fetching cart info:', error);
      itemCount.value = 0;
    } finally {
      loading.value = false;
    }
  };

  return {
    itemCount,
    loading,
    setItemCount,
    getItemCount,
    increment,
    decrement,
    fetchCartInfo
  };
}