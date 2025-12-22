<!-- src/widgets/CatalogSideBar/ui/CatalogSideBar.vue -->
<template>
  <div class="catalog-sidebar bg-grey-1 q-pa-md">
    <q-list padding>
      <q-item-label header class="text-weight-bold">
        Категории ({{ categories.length }})
      </q-item-label>

      <!-- Динамически рендерим категории -->
      <q-item 
        v-for="category in categories"
        :key="category.id"
        clickable 
        v-ripple 
        :active="activeCategoryId === category.id"
        @click="$emit('select', category.id)"
      >
        <q-item-section>
          {{ category.name }}
        </q-item-section>
        
        <!-- Галочка для активной категории -->
        <q-item-section avatar v-if="activeCategoryId === category.id">
          <q-icon name="check" color="primary" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
// Импортируем getAllCategories из конфига
import { getAllCategories } from 'src/entities/catalog/config/categories'

export default {
  name: 'CatalogSideBar',
  props: {
    activeCategoryId: String
  },
  data() {
    return {
      categories: getAllCategories()  // Используем функцию
    }
  }
}
</script>

<style scoped>
.q-item--active {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: bold;
}
</style>