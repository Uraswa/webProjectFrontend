<template>
  <q-page class="product-filter-page">
    <!-- Хлебные крошки -->
    <q-breadcrumbs class="breadcrumbs-adaptive">
      <q-breadcrumbs-el label="Главная" to="/" />
      <q-breadcrumbs-el 
        v-if="selectedCategory" 
        :label="selectedCategory.name" 
      />
      <q-breadcrumbs-el 
        v-else 
        label="Все товары" 
      />
    </q-breadcrumbs>

    <!-- Заголовок и сортировка -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            {{ pageTitle }}
          </h1>
          <div v-if="!loading" class="products-count">
            Найдено {{ totalProducts }} товаров
            <span v-if="searchQuery"> по запросу "{{ searchQuery }}"</span>
          </div>
        </div>
        
        <!-- Сортировка -->
        <div class="sort-section">
          <q-select
            v-model="sortModel"
            :options="sortOptions"
            label="Сортировка"
            dense
            outlined
            class="sort-select"
            emit-value
            map-options
            @update:model-value="handleSortChange"
          />
        </div>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="page-content">
      <div class="content-layout">
        <!-- Фильтры - левая колонка -->
        <div class="filters-column">
          <div class="sticky-filters">
            <SearchFiltersPanel
              :loading="loading"
              @apply-filters="loadProducts"
              @reset-filters="loadProducts"
              @filter-change="handleFilterChange"
            />
          </div>
        </div>

        <!-- Товары - правая колонка -->
        <div class="products-column">
          <!-- Состояние загрузки -->
          <div v-if="loading" class="loading-state">
            <q-spinner-gears color="primary" size="3em" />
            <div class="loading-text">Загружаем товары...</div>
          </div>

          <!-- Результаты -->
          <div v-else class="products-container">
            <!-- Пустое состояние -->
            <div v-if="products.length === 0" class="empty-state">
              <q-icon name="search_off" size="4em" color="grey-4" class="empty-icon" />
              <div class="empty-title">Товары не найдены</div>
              <div class="empty-subtitle">Попробуйте изменить параметры поиска</div>
              <q-btn 
                label="Сбросить фильтры" 
                color="primary" 
                outline 
                @click="resetAllFilters" 
                class="reset-btn"
              />
            </div>

            <!-- Сетка товаров -->
            <div v-else class="products-grid">
              <div
                v-for="product in products"
                :key="product.product_id"
                class="product-card-wrapper"
              >
                <ProductCard :product="product" />
              </div>
            </div>

            <!-- Пагинация -->
            <div v-if="pagination.total_pages > 1" class="pagination-container">
              <q-pagination
                v-model="currentPage"
                :max="pagination.total_pages"
                :max-pages="paginationMaxPages"
                direction-links
                boundary-links
                color="primary"
                class="pagination"
                @update:model-value="handlePageChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchFilters } from 'src/features/productSearch/model/useSearchFilters'
import { useCategories } from 'src/features/productSearch/model/useCategories'
import { productSearchApi } from 'src/features/productSearch/api/productSearchApi'
import ProductCard from 'src/widgets/ProductCard/ui/ProductCard.vue'
import SearchFiltersPanel from 'src/features/productSearch/ui/SearchFiltersPanel.vue'
import type { Product } from 'src/entities/Product/models/Product'

export default defineComponent({
  name: 'ProductFilterPage',
  
  components: {
    ProductCard,
    SearchFiltersPanel
  },
  
  setup() {
    const route = useRoute()
    const searchFilters = useSearchFilters()
    const categories = useCategories()
    
    const products = ref<Product[]>([])
    const loading = ref(false)
    const pagination = ref({
      page: 1,
      limit: 12,
      total: 0,
      total_pages: 1
    })
    const currentPage = ref(1)
    const sortModel = ref('created_at:desc')
    const isMobile = ref(false)
    
    const sortOptions = [
      { label: 'По популярности', value: 'created_at:desc' },
      { label: 'По цене ↑', value: 'price:asc' },
      { label: 'По цене ↓', value: 'price:desc' },
      { label: 'По названию', value: 'name:asc' }
    ]
    
    // Адаптивная пагинация
    const paginationMaxPages = computed(() => {
      return isMobile.value ? 3 : 6
    })
    
    const searchQuery = computed(() => searchFilters.filters.value.search)
    
    const selectedCategory = computed(() => {
      if (searchFilters.filters.value.category_id) {
        return categories.categories.value.find(
          cat => cat.category_id === searchFilters.filters.value.category_id
        )
      }
      return null
    })
    
    const pageTitle = computed(() => {
      if (searchQuery.value) return `Поиск: "${searchQuery.value}"`
      if (selectedCategory.value) return selectedCategory.value.name
      return 'Все товары'
    })
    
    const totalProducts = computed(() => pagination.value.total)
    
    // Определение типа устройства
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768
    }
    
    const loadProducts = async () => {
      loading.value = true
      try {
        const params = searchFilters.getApiParams()
        const response = await productSearchApi.searchProducts(params)
        
        products.value = response.products
        pagination.value = response.pagination
        currentPage.value = response.pagination.page
        
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
      } finally {
        loading.value = false
      }
    }
    
    const handlePageChange = (page: number) => {
      currentPage.value = page
      searchFilters.updateFilter('page', page)
    }
    
    const handleSortChange = (sortValue: string) => {
      const [order_by, order_direction] = sortValue.split(':')
      searchFilters.updateFilter('order_by', order_by)
      searchFilters.updateFilter('order_direction', order_direction)
      sortModel.value = sortValue
    }
    
    const handleFilterChange = () => {
      loadProducts()
    }
    
    const resetAllFilters = () => {
      searchFilters.resetAllFilters()
      sortModel.value = 'created_at:desc'
      loadProducts()
    }
    
    onMounted(async () => {
      // Определяем тип устройства
      checkMobile()
      window.addEventListener('resize', checkMobile)
      
      await categories.loadCategories()
      
      if (route.query.order_by && route.query.order_direction) {
        sortModel.value = `${route.query.order_by}:${route.query.order_direction}`
      } else {
        sortModel.value = 'created_at:desc'
      }
      
      loadProducts()
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })
    
    watch(() => route.query, () => {
      loadProducts()
    }, { deep: true })
    
    return {
      products,
      loading,
      pagination,
      currentPage,
      sortModel,
      sortOptions,
      searchQuery,
      selectedCategory,
      pageTitle,
      totalProducts,
      paginationMaxPages,
      isMobile,
      handlePageChange,
      handleSortChange,
      handleFilterChange,
      resetAllFilters,
      loadProducts
    }
  }
})
</script>

<style scoped>
/* Базовые стили */
.product-filter-page {
  padding: 16px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Хлебные крошки */
.breadcrumbs-adaptive {
  margin-bottom: 16px;
  font-size: 0.9rem;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
}

.breadcrumbs-adaptive::-webkit-scrollbar {
  height: 3px;
}

.breadcrumbs-adaptive::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.breadcrumbs-adaptive::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

/* Шапка страницы */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title-section {
  order: 1;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color:rgb(0, 0, 0);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.products-count {
  font-size: 0.95rem;
  color: #666;
}

.sort-section {
  order: 2;
}

.sort-select {
  width: 100%;
  max-width: 100%;
}

/* Основной контент */
.page-content {
  position: relative;
}

.content-layout {
  display: flex;
  gap: 24px;
  flex-direction: column;
}

/* Фильтры - левая колонка */
.filters-column {
  order: 1;
  width: 100%;
}

.sticky-filters {
  position: sticky;
  top: 20px;
}

/* Товары - правая колонка */
.products-column {
  order: 2;
  width: 100%;
}

/* Состояние загрузки */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.loading-text {
  margin-top: 16px;
  font-size: 1rem;
  color: #666;
}

/* Результаты */
.products-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Пустое состояние */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 20px;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 1rem;
  color: #888;
  margin-bottom: 24px;
  max-width: 300px;
}

.reset-btn {
  min-width: 160px;
}

/* Сетка товаров */
.products-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

.product-card-wrapper {
  width: 100%;
}

/* Пагинация */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.pagination {
  border-radius: 8px;
  padding: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* ===== АДАПТИВНОСТЬ ===== */

/* Мобильные устройства (≤767px) */
@media (max-width: 767px) {
  .product-filter-page {
    padding: 12px;
  }
  
  .page-title {
    font-size: 1.35rem;
  }
  
  .products-count {
    font-size: 0.9rem;
  }
  
  .content-layout {
    flex-direction: column;
    gap: 16px;
  }
  
  .filters-column {
    width: 100%;
  }
  
  .products-container {
    padding: 16px;
  }
  
  .products-grid {
    gap: 16px;
  }
  
  .pagination-container {
    margin-top: 24px;
    padding-top: 20px;
  }
}

/* Планшеты (768px-991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .product-filter-page {
    padding: 20px;
  }
  
  .content-layout {
    flex-direction: row;
    gap: 20px;
  }
  
  .filters-column {
    order: 1;
    flex: 0 0 280px;
  }
  
  .products-column {
    order: 2;
    flex: 1;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .title-section {
    flex: 1;
    min-width: 0;
  }
  
  .sort-section {
    flex: 0 0 200px;
  }
  
  .sort-select {
    min-width: 200px;
  }
}

/* Десктоп (992px-1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .product-filter-page {
    padding: 24px;
  }
  
  .content-layout {
    flex-direction: row;
    gap: 32px;
  }
  
  .filters-column {
    order: 1;
    flex: 0 0 280px;
  }
  
  .products-column {
    order: 2;
    flex: 1;
  }
  
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .header-content {
    flex-direction: row;
    align-items: center;
  }
  
  .sort-select {
    min-width: 220px;
  }
}

/* Большие десктопы (≥1200px) */
@media (min-width: 1200px) {
  .product-filter-page {
    padding: 32px;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .content-layout {
    flex-direction: row;
    gap: 40px;
  }
  
  .filters-column {
    order: 1;
    flex: 0 0 280px;
  }
  
  .products-column {
    order: 2;
    flex: 1;
  }
  
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-content {
    flex-direction: row;
    align-items: center;
  }
  
  .sort-select {
    min-width: 250px;
  }
}

/* Очень маленькие экраны (≤480px) */
@media (max-width: 480px) {
  .product-filter-page {
    padding: 8px;
  }
  
  .breadcrumbs-adaptive {
    font-size: 0.85rem;
  }
  
  .page-title {
    font-size: 1.2rem;
  }
  
  .products-count {
    font-size: 0.85rem;
  }
  
  .products-container {
    padding: 12px;
  }
  
  .products-grid {
    gap: 12px;
  }
  
  .empty-state {
    padding: 32px 16px;
  }
  
  .empty-title {
    font-size: 1.1rem;
  }
  
  .empty-subtitle {
    font-size: 0.9rem;
  }
  
  .reset-btn {
    min-width: 140px;
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>