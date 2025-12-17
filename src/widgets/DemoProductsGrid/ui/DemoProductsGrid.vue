<script>
import ProductCard from "src/widgets/ProductCard/ui/ProductCard.vue";

export default {
  name: "DemoProductsGrid",
  components: { ProductCard },

  data() {
    return {
      demoProducts: [
        {
          id: 1,
          name: 'Товар с алиэкспресс',
          price: 300,
          order_count: 10,
          photos: '["https://cdn.quasar.dev/img/mountains.jpg"]',
          reviewsCount: 228
        },
        // добавь остальные если надо
      ]
    }
  }
}
</script>

<template>
  <div class="row">
    <div 
      class="col-lg-3 col-md-4 col-sm-6 col-12"
      :style="prodIndex % 4 === 0 ? 'padding: 15px 15px 15px 0;' : 'padding: 15px 15px;'"
      v-for="(prod, prodIndex) in demoProducts"
      :key="prod.id"
    >
      <ProductCard :product="prod"/>
    </div>
  </div>
</template>
