<script lang="ts">
import ProductCard from "src/widgets/ProductCard/ui/ProductCard.vue";
import type { Product } from 'entities/Product/models/Product'
import { defineComponent } from 'vue'

export default defineComponent({
  name: "DemoProductsGrid",
  components: { ProductCard },

  props: {
    products: {
      type: Array as () => Product[],
      default: () => [] // если проп не передан, будет пустой массив
    }
  }
})
</script>

<template>
  <div>
    <div v-if="products.length === 0" class="text-center">
      Товары не найдены
    </div>

    <div class="row q-col-gutter-md" v-else>
      <div 
        class="col-lg-3 col-md-4 col-sm-6 col-12"
        v-for="product in products"
        :key="product.product_id"
      >
        <ProductCard :product="product"/>
      </div>
    </div>
  </div>
</template>