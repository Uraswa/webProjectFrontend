<!-- pages/ProductFilterPage/ProductFilterPage.vue -->
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
        <q-card flat bordered class="q-pa-md sticky-filters">
          <div class="text-h6 text-weight-bold q-mb-md">Фильтры</div>

          <!-- Цена -->
          <div class="q-mb-md">
            <div class="text-weight-medium q-mb-sm">Цена, ₽</div>
            <div class="row items-center q-col-gutter-sm">
              <div class="col">
                <q-input
                  :model-value="minPrice"
                  @update:model-value="val => updatePrice('min', val)"
                  label="От"
                  type="number"
                  dense
                  outlined
                  min="0"
                />
              </div>
              <div class="col">
                <q-input
                  :model-value="maxPrice"
                  @update:model-value="val => updatePrice('max', val)"
                  label="До"
                  type="number"
                  dense
                  outlined
                  min="0"
                />
              </div>
            </div>
          </div>

          <!-- Активные фильтры -->
          <div v-if="hasActiveFilters" class="q-mb-lg">
            <div class="text-caption text-grey-7 q-mb-xs">Активные фильтры:</div>
            <div class="q-gutter-xs">
              <q-chip
                v-if="searchQuery"
                removable
                dense
                @remove="clearSearch"
                color="primary"
                text-color="white"
              >
                Поиск: {{ searchQuery }}
              </q-chip>
              <q-chip
                v-if="minPrice > 0 || maxPrice"
                removable
                dense
                @remove="resetPrice"
                color="primary"
                text-color="white"
              >
                Цена: {{ priceRangeText }}
              </q-chip>
            </div>
          </div>

          <!-- Кнопки фильтров -->
          <div>
            <q-btn
              label="Применить"
              color="primary"
              class="full-width q-mb-sm"
              unelevated
              @click="applyFilters"
              :loading="loading"
            />
            <q-btn
              label="Сбросить всё"
              outline
              class="full-width"
              @click="resetAllFilters"
              :disable="!hasActiveFilters"
            />
          </div>
        </q-card>
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
import SearchFiltersPanel from 'src/features/productSearch/ui/SearchFilterPanel.vue'
import type { Product } from 'src/entities/Product/models/Product'

export default defineComponent({
  name: 'ProductSearchPage',
  
  components: {
    ProductCard
  },

  data() {
    return {
      // 🔍 Поиск
      searchQuery: '',
      
      // 💰 Цена
      minPrice: 0,
      maxPrice: null, 
      
      // 📊 Сортировка (новый формат)
      sortModel: 'created_at:desc',
      sortOptions: [
        { label: 'По новизне', value: 'created_at:desc' },
        { label: 'По цене ↑', value: 'price:asc' },
        { label: 'По цене ↓', value: 'price:desc' },
        { label: 'По названию', value: 'name:asc' }
      ],
      
      // 📦 Товары
      products: [],
      loading: false,
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        total_pages: 1
      },
      currentPage: 1,
      
      // 📍 Текущая категория
      currentCategory: null
    }
  },
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    const searchFilters = useSearchFilters()
    const categories = useCategories()
    
    hasActiveFilters() {
      return this.searchQuery || this.minPrice > 0 || this.maxPrice !== null 
    },
    
    priceRangeText() {
      const min = this.minPrice || 0
      const max = this.maxPrice === null ? '∞' : this.maxPrice 
      return `${min} - ${max}₽`
    },
    
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
    
    // 🔥 Watch на изменение сортировки
    sortModel() {
      this.currentPage = 1
      this.updateUrl()
    }
  },

  methods: {
    // 📍 Загрузка параметров из URL
    loadFromUrl() {
      const query = this.$route.query
      
      this.searchQuery = query.search || ''
      this.minPrice = Number(query.min_price) || 0
      this.maxPrice = query.max_price ? Number(query.max_price) : null 
      this.currentPage = Number(query.page) || 1
      
      // Восстанавливаем сортировку из URL
      if (query.order_by && query.order_direction) {
        this.sortModel = `${query.order_by}:${query.order_direction}`
      } else {
        this.sortModel = 'created_at:desc'
      }
    },

    // 🔄 Обновление URL с фильтрами
    updateUrl() {
      const query = {}
      
      if (this.searchQuery) query.search = this.searchQuery
      if (this.minPrice > 0) query.min_price = this.minPrice
      if (this.maxPrice !== null) query.max_price = this.maxPrice 
      if (this.sortModel !== 'created_at:desc') {
        query.order_by = this.sortBy
        query.order_direction = this.sortDirection
      }
      if (this.currentPage > 1) query.page = this.currentPage
      
      this.$router.push({
        path: this.$route.path,
        query
      })
    },

    // 🚀 Загрузка товаров с API
    async loadProducts() {
      this.loading = true
      
      try {
        const params = searchFilters.getApiParams()
        const response = await productSearchApi.searchProducts(params)
        
        products.value = response.products
        pagination.value = response.pagination
        currentPage.value = response.pagination.page
        
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
      } finally {
        this.loading = false
      }
    },

    // 💰 Обновление цены
    updatePrice(type, value) {
      if (type === 'min') {
        this.minPrice = Number(value) || 0
      } else {
        this.maxPrice = value !== '' ? Number(value) : null 
      }
      this.applyFilters()
    },

    // 🗑️ Сброс цены
    resetPrice() {
      this.minPrice = 0
      this.maxPrice = null 
      this.applyFilters()
    },

    // 🔍 Очистка поиска
    clearSearch() {
      this.searchQuery = ''
      this.applyFilters()
    },

    // 📄 Изменение страницы
    handlePageChange(page) {
      this.currentPage = page
      this.updateUrl()
    },

    // 🎯 Применить все фильтры
    applyFilters() {
      this.currentPage = 1
      this.updateUrl()
    },

    // 🗑️ Сбросить все фильтры
    resetAllFilters() {
      this.searchQuery = ''
      this.minPrice = 0
      this.maxPrice = null 
      this.sortModel = 'created_at:desc'
      this.currentPage = 1
      
      this.$router.push({ path: this.$route.path })
    },

    // 📦 Получить параметры для API
    getApiParams() {
      return {
        search: this.searchQuery || undefined,
        min_price: this.minPrice > 0 ? this.minPrice : undefined,
        max_price: this.maxPrice !== null ? this.maxPrice : undefined, 
        order_by: this.sortBy,
        order_direction: this.sortDirection,
        page: this.currentPage,
        limit: this.pagination.limit
      }
      
      loadProducts()
    })
    
    watch(() => route.query, () => {
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