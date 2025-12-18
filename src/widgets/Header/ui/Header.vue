<template>
  <div class="row items-center header">
    <div class="col-1">
      <RouterLink to="/">
        <p style="margin: 0; font-size: 2em">Sellzy</p>
      </RouterLink>
    </div>

    <div class="col-2" style="display: flex; justify-content: space-around">
      <q-btn 
        icon="menu" 
        label="Каталог" 
        :to="{ name: 'catalog' }" 
      />
    </div>

    <!-- 🔽 ПОИСК -->
    <div class="col-6">
      <ProductSearchInput />
    </div>

    <div class="col-3" style="display:flex; justify-content: center;">
      <q-btn round flat icon="shopping_basket" to="/cart/" />
      <q-btn round flat icon="account_circle" to="/orders/" />
    </div>
  </div>
</template>

<script>
import ProductSearchInput from 'src/features/productSearch/ui/productSearchInput.vue'

export default {
  name: 'Header',
  components: {
    ProductSearchInput
  }
}
</script>

<style scoped>
.header {
  padding: 10px 0;
  background-color: white;
}
</style>
