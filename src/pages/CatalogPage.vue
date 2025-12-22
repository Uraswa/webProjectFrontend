<!-- src/pages/CatalogPage.vue -->
<template>
  <q-page class="q-pa-md">
    <!-- Состояние загрузки -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
      <div class="text-grey-7 q-mt-md">Загрузка категорий...</div>
    </div>

    <!-- Ошибка загрузки -->
    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error_outline" color="negative" size="3em" />
      <div class="text-h6 text-negative q-mt-md">{{ error }}</div>
      <q-btn
        flat
        color="primary"
        label="Попробовать снова"
        @click="loadCategories"
        class="q-mt-md"
      />
    </div>

    <!-- Контент -->
    <div v-else class="row q-col-gutter-lg">
      <!-- Боковая панель -->
      <div class="col-12 col-md-3">
        <CatalogSideBar
          :active-category-id="selectedCategoryId"
          :categories="categoriesHierarchy"
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
          <SubcategoryList
            :category-id="selectedCategoryId"
            :category="currentCategory"
          />
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
import { catalogApi } from 'src/entities/catalog/api/catalogApi'
import {
  transformCategoriesToHierarchy,
  getCategoryFromHierarchy,
  getFirstCategory,
  getTotalSubcategories
} from 'src/entities/catalog/lib/transformCategories'

export default {
  name: 'CatalogPage',
  components: {
    CatalogSideBar,
    SubcategoryList
  },
  data() {
    return {
      selectedCategoryId: null,
      categoriesHierarchy: {},
      loading: false,
      error: null
    }
  },
  computed: {
    currentCategory() {
      if (!this.selectedCategoryId) return null
      return getCategoryFromHierarchy(this.categoriesHierarchy, this.selectedCategoryId)
    },

    totalSubcategories() {
      return getTotalSubcategories(this.currentCategory)
    }
  },
  async mounted() {
    await this.loadCategories()
  },
  methods: {
    async loadCategories() {
      try {
        this.loading = true
        this.error = null

        const response = await catalogApi.getCategories()

        if (response.success && response.data?.categories) {
          // Преобразуем плоский список категорий в иерархическую структуру
          this.categoriesHierarchy = transformCategoriesToHierarchy(response.data.categories)

          // Устанавливаем первую категорию как выбранную по умолчанию
          const firstCategory = getFirstCategory(this.categoriesHierarchy)
          if (firstCategory) {
            this.selectedCategoryId = firstCategory.id
          }
        } else {
          this.error = 'Не удалось загрузить категории'
          console.error('Invalid response format:', response)
        }
      } catch (err) {
        this.error = 'Ошибка при загрузке категорий'
        console.error('Error loading categories:', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>