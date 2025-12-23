<!-- src/widgets/CatalogSideBar/ui/CatalogSideBar.vue -->
<template>
  <div class="catalog-sidebar bg-grey-1 q-pa-md">
    <q-list padding>
      <q-item-label header class="text-weight-bold">
        Категории ({{ categoriesArray.length }})
      </q-item-label>

      <!-- Динамически рендерим категории -->
      <q-item
        v-for="category in categoriesArray"
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
export default {
  name: 'CatalogSideBar',
  props: {
    activeCategoryId: [String, Number],
    categories: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    categoriesArray() {
      // Преобразуем объект категорий в массив
      return Object.values(this.categories).map(cat => ({
        id: cat.id,
        name: cat.name
      }))
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