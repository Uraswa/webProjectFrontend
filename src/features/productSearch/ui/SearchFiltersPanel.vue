<template>
  <q-card flat bordered class="q-pa-md" style="position: sticky; top: 20px">
    <div class="text-h6 text-weight-bold q-mb-md">Фильтры</div>

    <!-- Цена -->
    <FilterGroup label="Цена" default-opened>
      <div class="row items-center q-col-gutter-sm">
        <div class="col">
          <q-input
            v-model.number="localMinPrice"
            type="number"
            label="От"
            dense
            outlined
            min="0"
            @update:model-value="handlePriceChange"
            debounce="500"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="localMaxPrice"
            type="number"
            label="До"
            dense
            outlined
            min="0"
            @update:model-value="handlePriceChange"
            debounce="500"
          />
        </div>
      </div>
    </FilterGroup>

    <!-- Категория -->
    <FilterGroup label="Категория" default-opened>
      <CategoryFilter
        v-model="selectedCategoryId"
        @category-change="handleCategoryChange"
      />
    </FilterGroup>

    <!-- Фильтры характеристик -->
    <template v-for="filter in characteristicFilters" :key="filter.id">
      <FilterGroup :label="filter.name">
        <FilterRenderer :filter="filter" @change="handleFilterChange" />
      </FilterGroup>
    </template>

    <!-- Активные фильтры -->
    <div v-if="activeFilters.length > 0" class="q-mt-md">
      <div class="text-weight-medium q-mb-sm">Активные фильтры:</div>
      <div class="q-gutter-xs">
        <q-chip
          v-for="filter in activeFilters"
          :key="filter.id"
          removable
          dense
          @remove="() => handleRemoveFilter(filter.id, filter.type)"
          color="primary"
          text-color="white"
        >
          {{ getFilterLabel(filter) }}
        </q-chip>
      </div>
    </div>

    <!-- Кнопки управления -->
    <div class="q-mt-lg">
      <q-btn
        v-if="!autoApply"
        label="Применить фильтры"
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
      />
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useSearchFilters } from '../model/useSearchFilters'
import { useCategories } from '../model/useCategories'
import CategoryFilter from './CategoryFilter.vue'
import FilterGroup from './FilterGroup.vue'
import FilterRenderer from './FilterRenderer.vue'
import ProductSearchInput from './ProductSearchInput.vue'
import type { ActiveFilter } from '../model/types'

// Вспомогательная функция дебаунс
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default defineComponent({
  name: 'SearchFiltersPanel',
  
  components: {
    CategoryFilter,
    FilterGroup,
    FilterRenderer,
    ProductSearchInput
  },
  
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    autoApply: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['apply-filters', 'reset-filters', 'filter-change'],
  
  setup(props, { emit }) {
    const searchFilters = useSearchFilters()
    const categories = useCategories()
    
    const localMinPrice = ref<number | undefined>(undefined)
    const localMaxPrice = ref<number | undefined>(undefined)
    const selectedCategoryId = ref<number | undefined>(undefined)
    
    // Дебаунс для авто-применения
    const applyWithDebounce = debounce(() => {
      if (props.autoApply) {
        applyFilters()
      }
    }, 500)
    
    // Инициализация из URL
    onMounted(() => {
      localMinPrice.value = searchFilters.filters.value.min_price
      localMaxPrice.value = searchFilters.filters.value.max_price
      selectedCategoryId.value = searchFilters.filters.value.category_id
      
      if (selectedCategoryId.value) {
        categories.loadFilters(selectedCategoryId.value)
      }
    })
    
    // Следим за изменением категории в URL
    watch(() => searchFilters.filters.value.category_id, async (categoryId) => {
      selectedCategoryId.value = categoryId
      if (categoryId) {
        await categories.loadFilters(categoryId)
        if (props.autoApply) {
          applyFilters()
        }
      } else {
        categories.characteristicFilters.value = []
      }
    })
    
    // Следим за изменением цены в URL (синхронизация обратно)
    watch(() => searchFilters.filters.value.min_price, (minPrice) => {
      if (minPrice !== localMinPrice.value) {
        localMinPrice.value = minPrice
      }
    })
    
    watch(() => searchFilters.filters.value.max_price, (maxPrice) => {
      if (maxPrice !== localMaxPrice.value) {
        localMaxPrice.value = maxPrice
      }
    })
    
    // Обработчики
    const handleCategoryChange = (categoryId?: number) => {
      searchFilters.updateCategory(categoryId)
      emit('filter-change', { type: 'category', value: categoryId })
      
      if (props.autoApply) {
        applyFilters()
      }
    }
    
    const handlePriceChange = () => {
      searchFilters.updateFilter('min_price', localMinPrice.value)
      searchFilters.updateFilter('max_price', localMaxPrice.value)
      emit('filter-change', { 
        type: 'price', 
        value: { min: localMinPrice.value, max: localMaxPrice.value }
      })
      
      if (props.autoApply) {
        applyWithDebounce()
      }
    }
    
    const handleFilterChange = (data: any) => {
      console.log('🔄 [SearchFiltersPanel] Filter change data:', data)
      
      if (data.values !== undefined) {
        searchFilters.addCharacteristicFilter(data.filterId, data.values)
      } else if (data.value !== undefined) {
        searchFilters.addCharacteristicFilter(data.filterId, data.value)
      } else {
        searchFilters.addCharacteristicFilter(data.filterId, undefined, data.min, data.max)
      }
      
      emit('filter-change', { type: 'characteristic', value: data })
      
      if (props.autoApply) {
        applyWithDebounce()
      }
    }
    
    const handleRemoveFilter = (filterId: string, filterType: string) => {
      searchFilters.removeActiveFilter(filterId, filterType)
      emit('filter-change', { type: 'remove', value: { filterId, filterType } })
      
      if (props.autoApply) {
        applyFilters()
      }
    }
    
    const applyFilters = () => {
      // Обновляем только измененные значения
      if (localMinPrice.value !== searchFilters.filters.value.min_price) {
        searchFilters.updateFilter('min_price', localMinPrice.value)
      }
      if (localMaxPrice.value !== searchFilters.filters.value.max_price) {
        searchFilters.updateFilter('max_price', localMaxPrice.value)
      }
      emit('apply-filters')
    }
    
    const resetAllFilters = () => {
      searchFilters.resetAllFilters()
      localMinPrice.value = undefined
      localMaxPrice.value = undefined
      selectedCategoryId.value = undefined
      categories.characteristicFilters.value = []
      emit('reset-filters')
    }
    
    const getFilterLabel = (filter: ActiveFilter) => {
      switch (filter.type) {
        case 'price':
          const min = filter.value.min || 0
          const max = filter.value.max || '∞'
          return `Цена: ${min} - ${max}₽`
        case 'category':
          return `Категория: ${filter.value}`
        case 'characteristic':
          return `${filter.label}: ${filter.value.displayValue || filter.value.value || ''}`
        case 'search':
          return `Поиск: "${filter.value}"`
        default:
          return filter.label
      }
    }
    
    return {
      activeFilters: searchFilters.activeFilters,
      hasActiveFilters: searchFilters.hasActiveFilters,
      characteristicFilters: categories.characteristicFilters,
      localMinPrice,
      localMaxPrice,
      selectedCategoryId,
      handleCategoryChange,
      handlePriceChange,
      handleFilterChange,
      handleRemoveFilter,
      applyFilters,
      resetAllFilters,
      getFilterLabel
    }
  }
})
</script>

<style scoped>
/* Дополнительные стили если нужно */
.q-input {
  font-size: 14px;
}
</style>