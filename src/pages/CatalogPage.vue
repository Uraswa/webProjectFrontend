<!-- src/pages/CatalogPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-lg">
      <!-- Боковая панель -->
      <div class="col-12 col-md-3">
        <CatalogSideBar 
          :active-category-id="selectedCategoryId"
          @select="selectedCategoryId = $event" 
        />
      </div>
      
      <!-- Контент -->
      <div class="col-12 col-md-9">
        <template v-if="currentCategory">
          <!-- Заголовок -->
          <div class="q-mb-lg">
            <h1 class="text-h4 text-primary q-my-none">
              {{ currentCategory.name }}
            </h1>
            <div class="text-caption text-grey-7">
              {{ totalSubcategories }} подкатегорий в {{ currentCategory.groups?.length || 0 }} группах
            </div>
          </div>
          
          <!-- Список подкатегорий -->
          <SubcategoryList :category-id="selectedCategoryId" />
        </template>
        
        <div v-else class="text-center q-pa-xl text-grey-6">
          Категория не найдена
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CatalogSideBar from 'src/widgets/CatalogSideBar/ui/CatalogSideBar.vue'
import SubcategoryList from 'src/widgets/SubcategoryList/ui/SubcategoryList.vue'
import { getDefaultCategory, getCategoryById, getTotalSubcategories } from 'src/entities/catalog/config/categories'

export default {
  name: 'CatalogPage',
  components: {
    CatalogSideBar,
    SubcategoryList
  },
  data() {
    return {
      selectedCategoryId: getDefaultCategory().id
    }
  },
  computed: {
    currentCategory() {
      return getCategoryById(this.selectedCategoryId)
    },
    
    totalSubcategories() {
      return getTotalSubcategories(this.currentCategory)
    }
  }
}
</script>