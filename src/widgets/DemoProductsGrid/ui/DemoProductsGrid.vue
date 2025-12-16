<script>
import ProductCard from "src/widgets/ProductCard/ui/ProductCard.vue";

export default {
  name: "ProductsGrid",
  components: { ProductCard },
  props: {
    products: {
      type: Array,
      required: true
    }
  }
}
</script>

<template>
  <div class="row">
    <div 
      class="col-lg-3 col-md-4 col-sm-6 col-12"
      v-for="(prod, prodIndex) in products"
      :key="prod.id"
      :style="prodIndex % 4 === 0 ? 'padding: 15px 15px 15px 0;' : 'padding: 15px 15px;'"
    >
      <ProductCard :product="prod"/>
    </div>
  </div>
</template>
