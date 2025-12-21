import { ref } from 'vue';

// Простой реактивный store для количества товаров в корзине
const itemCount = ref(0);

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

  return {
    itemCount,
    setItemCount,
    getItemCount,
    increment,
    decrement
  };
}