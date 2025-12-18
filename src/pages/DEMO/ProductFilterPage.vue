<template>
  <q-page class="q-pa-lg">
    <!-- Заголовок -->
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
                v-if="minPrice > 0 || maxPrice < 10000"
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
            <q-btn label="Сбросить фильтры" color="primary" outline @click="resetAllFilters" />
          </div>

          <!-- Сетка товаров -->
          <div v-else class="row q-col-gutter-lg">
            <div
              v-for="product in products"
              :key="product.product_id"
              class="col-md-4 col-sm-6 col-12"
            >
              <ProductCard :product="product" />
            </div>
          </div>

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
            <div class="text-caption text-grey-7 text-center full-width q-mt-sm">
              Страница {{ currentPage }} из {{ pagination.total_pages }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ProductCard from 'src/widgets/ProductCard/ui/ProductCard.vue'
import { productSearchApi } from 'src/features/productSearch/api/productSearchApi'

export default {
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
      maxPrice: 10000,
      
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

  computed: {
    pageTitle() {
      if (this.searchQuery) return `Поиск: "${this.searchQuery}"`
      if (this.currentCategory) return this.currentCategory.name
      return 'Все товары'
    },
    
    totalProducts() {
      return this.pagination.total
    },
    
    hasActiveFilters() {
      return this.searchQuery || this.minPrice > 0 || this.maxPrice < 10000
    },
    
    priceRangeText() {
      const min = this.minPrice || 0
      const max = this.maxPrice === 10000 ? '∞' : this.maxPrice
      return `${min} - ${max}₽`
    },
    
    // Разбиваем sortModel на order_by и order_direction
    sortBy() {
      return this.sortModel.split(':')[0]
    },
    
    sortDirection() {
      return this.sortModel.split(':')[1]
    }
  },

  created() {
    this.loadFromUrl()
    this.loadProducts()
  },

  watch: {
    '$route.query': {
      handler() {
        this.loadFromUrl()
        this.loadProducts()
      },
      deep: true
    },
    
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
      this.maxPrice = Number(query.max_price) || 10000
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
      if (this.maxPrice < 10000) query.max_price = this.maxPrice
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
        const params = this.getApiParams()
        console.log('🔍 Загружаем товары с параметрами:', params)
        
        const response = await productSearchApi.searchProducts(params)
        console.log('✅ Получен ответ:', response)
        
        this.products = response.products || []
        this.pagination = response.pagination || this.pagination
        
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
        alert('Не удалось загрузить товары. Проверьте консоль для деталей.')
      } finally {
        this.loading = false
      }
    },

    // 💰 Обновление цены
    updatePrice(type, value) {
      if (type === 'min') {
        this.minPrice = Number(value) || 0
      } else {
        this.maxPrice = Number(value) || 10000
      }
        this.applyFilters()
    },

    // 🗑️ Сброс цены
    resetPrice() {
      this.minPrice = 0
      this.maxPrice = 10000
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
      this.maxPrice = 10000
      this.sortModel = 'created_at:desc'
      this.currentPage = 1
      
      this.$router.push({ path: this.$route.path })
    },

    // 📦 Получить параметры для API
    getApiParams() {
      return {
        search: this.searchQuery || undefined,
        min_price: this.minPrice || undefined,
        max_price: this.maxPrice || undefined,
        order_by: this.sortBy,
        order_direction: this.sortDirection,
        page: this.currentPage,
        limit: this.pagination.limit
      }
    }
  }
}
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