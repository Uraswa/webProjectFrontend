<template>
  <q-page class="q-pa-lg">
    <!-- Хлебные крошки -->
    <q-breadcrumbs class="q-mb-md">
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
    <div class="row items-center justify-between q-mb-lg">
      <div class="col">
        <h4 class="q-my-none text-weight-bold">
          {{ pageTitle }}
        </h4>
        <div v-if="!loading" class="text-caption text-grey-7">
          Найдено {{ totalProducts }} товаров
          <span v-if="searchQuery"> по запросу "{{ searchQuery }}"</span>
        </div>
      </div>
      
      <!-- Сортировка -->
      <div class="col-auto">
        <q-select
          v-model="sortModel"
          :options="sortOptions"
          label="Сортировка"
          dense
          outlined
          style="min-width: 200px"
          emit-value
          map-options
          @update:model-value="handleSortChange"
        />
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Левая колонка - фильтры -->
      <div class="col-md-3 col-12">
        <SearchFiltersPanel
          :loading="loading"
          @apply-filters="loadProducts"
          @reset-filters="loadProducts"
          @filter-change="handleFilterChange"
        />
      </div>

      <!-- Правая колонка - товары -->
      <div class="col-md-9 col-12">
        <!-- Состояние загрузки -->
        <div v-if="loading" class="text-center q-py-xl">
          <q-spinner-gears color="primary" size="3em" />
          <div class="q-mt-md text-grey-7">Загружаем товары...</div>
        </div>

        <!-- Товары -->
        <div v-else>
          <!-- Пустое состояние -->
          <div v-if="products.length === 0" class="text-center q-py-xl">
            <q-icon name="search_off" size="4em" color="grey-4" class="q-mb-md" />
            <div class="text-h6 text-weight-medium q-mb-sm">Товары не найдены</div>
            <div class="text-grey-7 q-mb-lg">Попробуйте изменить параметры поиска</div>
            <q-btn 
              label="Сбросить фильтры" 
              color="primary" 
              outline 
              @click="resetAllFilters" 
            />
          </div>

          <!-- Сетка товаров (по 4 в ряд как в примере) -->
          <template v-else>
            <div 
              v-for="(row, rowIndex) in chunkedProducts" 
              :key="rowIndex"
              class="row"
            >
              <div
                v-for="product in row"
                :key="product.product_id"
                class="col-xl-3 col-lg-4 col-md-6 col-12"
                :style="rowIndex % 2 === 0 ? 'padding: 15px 15px 15px 0;' : 'padding: 15px 15px;'"
              >
                <ProductCard :product="product" />
              </div>
            </div>
          </template>

          <!-- Пагинация -->
          <div v-if="pagination.total_pages > 1" class="row justify-center q-mt-xl">
            <q-pagination
              v-model="currentPage"
              :max="pagination.total_pages"
              :max-pages="6"
              direction-links
              boundary-links
              color="primary"
              @update:model-value="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
    const router = useRouter()
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
    
    const sortOptions = [
      { label: 'По популярности', value: 'created_at:desc' },
      { label: 'По цене ↑', value: 'price:asc' },
      { label: 'По цене ↓', value: 'price:desc' },
      { label: 'По названию', value: 'name:asc' }
    ]
    
    // Разбиваем товары по 4 в ряд для правильной верстки
    const chunkedProducts = computed(() => {
      const chunkSize = 4
      const chunks = []
      for (let i = 0; i < products.value.length; i += chunkSize) {
        chunks.push(products.value.slice(i, i + chunkSize))
      }
      return chunks
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
    
    const loadProducts = async () => {
      loading.value = true
      try {
        const params = searchFilters.getApiParams()
        console.log('🔍 [ProductFilterPage] Загружаем товары с параметрами:', params)
        
        const response = await productSearchApi.searchProducts(params)
        console.log('✅ [ProductFilterPage] Получен ответ:', {
          productsCount: response.products.length,
          pagination: response.pagination
        })
        
        products.value = response.products
        pagination.value = response.pagination
        currentPage.value = response.pagination.page
        
      } catch (error) {
        console.error('❌ [ProductFilterPage] Ошибка загрузки товаров:', error)
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
      console.log('🚀 [ProductFilterPage] Компонент смонтирован')
      
      await categories.loadCategories()
      
      if (route.query.order_by && route.query.order_direction) {
        sortModel.value = `${route.query.order_by}:${route.query.order_direction}`
      } else {
        sortModel.value = 'created_at:desc'
      }
      
      loadProducts()
    })
    
    watch(() => route.query, () => {
      console.log('🔄 [ProductFilterPage] Изменились query параметры:', route.query)
      loadProducts()
    }, { deep: true })
    
    return {
      products,
      chunkedProducts,
      loading,
      pagination,
      currentPage,
      sortModel,
      sortOptions,
      searchQuery,
      selectedCategory,
      pageTitle,
      totalProducts,
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
.sticky-filters {
  position: sticky;
  top: 20px;
}

.q-pagination {
  border-radius: 8px;
  padding: 8px;
  background: white;
}
</style>