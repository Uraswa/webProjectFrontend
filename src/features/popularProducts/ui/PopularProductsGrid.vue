<script>
import ProductsGrid from "src/widgets/DemoProductsGrid/ui/DemoProductsGrid.vue";
import { popularProductsApi } from "src/features/popularProducts/api/popularProductsApi";

export default {
  name: "PopularProductsSection",
  components: { ProductsGrid },
  data() {
    return {
      products: []
    }
  },
  async mounted() {
    try {
      const res = await popularProductsApi.fetchPopularProducts(20);

      // Преобразуем данные под ProductCard
      this.products = res.map(p => ({
        id: p.product_id,
        title: p.name,
        price: parseFloat(p.price),
        prevPrice: 0,
        discount: 0,
        imageUrl: JSON.parse(p.photos)[0] || '',
        reviewsCount: p.order_count
      }));
    } catch (e) {
      console.error("Не удалось загрузить популярные товары", e);
    }
  }
}
</script>

<template>
  <ProductsGrid :products="products" />
</template>
