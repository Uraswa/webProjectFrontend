import { ref, computed, onMounted, watch } from 'vue';
import { useCart } from 'src/features/cart/model/useCart';
import { parseProductPhotos } from 'src/shared/utils/parsePhotos';

export function useCartPage() {
  const {
    cart,
    loading,
    error,
    fetchCart,
    updateCartItem,
    clearCart
  } = useCart();

  const selectedItems = ref<number[]>([]);
  const selectAll = ref(false);

  const cartItems = computed(() => {
    if (!cart.value) return [];
    return cart.value.items.map(item => ({
      id: item.product_id,
      product_id: item.product_id,
      name: item.product.name,
      description: item.product.description,
      image: parseProductPhotos(item.product.photos)[0] || 'https://cdn.quasar.dev/img/parallax2.jpg',
      price: parseFloat(item.product.price),
      quantity: item.quantity,
      product: item.product
    }));
  });

  const selectedItemsCount = computed(() => selectedItems.value.length);

  const totalPrice = computed(() => {
    return cartItems.value
      .filter(item => selectedItems.value.includes(item.id))
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  // Доставка всегда 0
  const deliveryPrice = 0;

  // Итог = цена товаров (доставка 0)
  const totalWithDelivery = computed(() => {
    return totalPrice.value;
  });

  async function increaseQuantity(productId: number) {
    const item = cartItems.value.find(item => item.id === productId);
    if (item) {
      await updateCartItem(productId, item.quantity + 1);
    }
  }

  async function decreaseQuantity(productId: number) {
    const item = cartItems.value.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      await updateCartItem(productId, item.quantity - 1);
    }
  }

  async function removeItem(productId: number) {
    await updateCartItem(productId, 0);
    // Удаляем из выбранных
    const index = selectedItems.value.indexOf(productId);
    if (index > -1) {
      selectedItems.value.splice(index, 1);
    }
  }

  async function removeSelectedItems() {
    if (selectedItems.value.length === 0) return;
    
    for (const productId of selectedItems.value) {
      await updateCartItem(productId, 0);
    }
    selectedItems.value = [];
  }

  function toggleItemSelect(productId: number) {
    const index = selectedItems.value.indexOf(productId);
    if (index > -1) {
      selectedItems.value.splice(index, 1);
    } else {
      selectedItems.value.push(productId);
    }
  }

  onMounted(() => {
    fetchCart();
    
    // При загрузке корзины, НЕ выбираем все автоматически
    // Пользователь сам решит, что выбрать
  });

  // Простая логика для selectAll
  watch(selectedItems, (newSelected) => {
    if (cartItems.value.length === 0) {
      selectAll.value = false;
      return;
    }
    
    // Выбраны ли ВСЕ товары?
    const allSelected = cartItems.value.length > 0 && 
                       cartItems.value.every(item => newSelected.includes(item.id));
    
    // Выбран ли ХОТЯ БЫ ОДИН товар?
    const someSelected = cartItems.value.some(item => newSelected.includes(item.id));
    
    if (allSelected) {
      selectAll.value = true;
    } else if (someSelected) {
      selectAll.value = false; // Некоторые выбраны, но не все
    } else {
      selectAll.value = false; // Ничего не выбрано
    }
  }, { deep: true });

  // Когда меняется selectAll
  watch(selectAll, (newValue) => {
    if (newValue === true) {
      // Ставим ВСЕ товары
      selectedItems.value = cartItems.value.map(item => item.id);
    } else {
      // Если снимаем "Выбрать все", но у нас есть выбранные товары,
      // это значит пользователь сам снял галочку с конкретного товара
      // В этом случае НЕ трогаем выбранные товары
      
      // Только если selectAll был true и мы его снимаем программно
      // (кликнули на "Выбрать все" когда он был активен)
      // тогда очищаем все
      if (selectedItems.value.length === cartItems.value.length) {
        selectedItems.value = [];
      }
    }
  });

  return {
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
    clearCart,
    removeSelectedItems,
    toggleItemSelect
  };
}