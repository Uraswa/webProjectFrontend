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

      this.products = res.map(p => ({
        product_id: p.product_id,
        name: p.name, 
        price: parseFloat(p.price),
        photos: p.photos,  
        order_count: p.order_count
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
