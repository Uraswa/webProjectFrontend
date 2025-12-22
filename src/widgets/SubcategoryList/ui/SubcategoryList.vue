<!-- src/widgets/SubcategoryList/ui/SubcategoryList.vue -->
<template>
  <div class="subcategory-list">
    <!-- Группы в 3 столбца -->
    <div v-if="category?.groups?.length > 0" class="row q-col-gutter-lg">
      <div 
        v-for="group in category.groups" 
        :key="group.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <!-- Группа -->
        <div class="group-section">
          <!-- Заголовок группы -->
          <h3 class="text-h6 text-weight-bold q-mb-md border-bottom">
            {{ group.name }}
          </h3>
          
          <!-- Список подкатегорий -->
          <div class="group-list">
            <div 
              v-for="subcat in group.subcategories" 
              :key="subcat.id"
              class="group-item"
              @click="goToPage(subcat.route)"
            >
              {{ subcat.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubcategoryList',
  props: {
    categoryId: {
      type: [String, Number],
      required: false
    },
    category: {
      type: Object,
      default: null
    }
  },
  methods: {
    goToPage(route) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped>
.group-section {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
}

.border-bottom {
  border-bottom: 2px solid #1976d2;
  padding-bottom: 8px;
}

.group-item {
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.group-item:hover {
  color: #1976d2;
}

.group-item:last-child {
  border-bottom: none;
}
</style>