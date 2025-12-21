import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import type { ProductSearchParams, ActiveFilter } from './types'

export function useSearchFilters() {
  const route = useRoute()
  const router = useRouter()
  
  const parseCharFilters = (query: any) => {
    if (!query.char_filters) return []
    
    try {
      if (typeof query.char_filters === 'string') {
        const parsed = JSON.parse(query.char_filters)
        console.log('🔍 [useSearchFilters] Parsed char_filters from URL:', parsed)
        return parsed
      }
      return query.char_filters
    } catch (e) {
      console.error('Ошибка парсинга char_filters:', e)
      return []
    }
  }
  
  const filters = computed(() => ({
    search: route.query.search as string || '',
    category_id: route.query.category_id ? Number(route.query.category_id) : undefined,
    min_price: route.query.min_price ? Number(route.query.min_price) : undefined,
    max_price: route.query.max_price ? Number(route.query.max_price) : undefined,
    order_by: (route.query.order_by as string) || 'created_at',
    order_direction: (route.query.order_direction as 'asc' | 'desc') || 'desc',
    page: route.query.page ? Number(route.query.page) : 1,
    limit: route.query.limit ? Number(route.query.limit) : 20,
    char_filters: parseCharFilters(route.query)
  }))
  
  const activeFilters = computed<ActiveFilter[]>(() => {
    const filtersList: ActiveFilter[] = []
    
    if (filters.value.search) {
      filtersList.push({
        id: 'search',
        type: 'search',
        label: 'Поиск',
        value: filters.value.search
      })
    }
    
    if (filters.value.min_price || filters.value.max_price) {
      filtersList.push({
        id: 'price',
        type: 'price',
        label: 'Цена',
        value: {
          min: filters.value.min_price,
          max: filters.value.max_price
        }
      })
    }
    
    filters.value.char_filters.forEach((filter: any, index: number) => {
      let label = ''
      let valueStr = ''
      
      if (filter.values && Array.isArray(filter.values)) {
        label = `Характеристика ${filter.filter}`
        valueStr = filter.values.join(', ')
      } else if (filter.value !== undefined) {
        label = `Характеристика ${filter.filter}`
        valueStr = String(filter.value)
      } else if (filter.min !== undefined || filter.max !== undefined) {
        label = `Характеристика ${filter.filter}`
        valueStr = `${filter.min || ''} - ${filter.max || ''}`
      }
      
      filtersList.push({
        id: `char_${filter.filter}_${index}`,
        type: 'characteristic',
        label,
        value: { ...filter, displayValue: valueStr }
      })
    })
    
    return filtersList
  })
  
  const hasActiveFilters = computed(() => {
    return activeFilters.value.length > 0
  })
  
  function updateFilter(key: string, value: any) {
    const query = { ...route.query }
    
    if (value === undefined || value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
      delete query[key]
    } else {
      query[key] = key === 'char_filters' ? JSON.stringify(value) : String(value)
    }
    
    if (key !== 'page') {
      query.page = '1'
    }
    
    console.log('🔄 [useSearchFilters] Updating URL with:', { key, value, query })
    router.push({ query })
  }
  
  function updateCategory(categoryId?: number) {
    updateFilter('category_id', categoryId)
  }
  
  function addCharacteristicFilter(filterId: string, value?: string | string[], min?: string, max?: string) {
    const currentFilters = [...filters.value.char_filters]
    const existingIndex = currentFilters.findIndex(f => f.filter === filterId)
    
    const newFilter: any = { filter: filterId }
    
    if (value !== undefined) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          newFilter.values = value
        } else {
          if (existingIndex >= 0) {
            currentFilters.splice(existingIndex, 1)
          }
          updateFilter('char_filters', currentFilters)
          return
        }
      } else {
        newFilter.value = value
      }
    }
    
    if (min !== undefined) newFilter.min = min
    if (max !== undefined) newFilter.max = max
    
    if (!newFilter.value && !newFilter.values && !newFilter.min && !newFilter.max) {
      if (existingIndex >= 0) {
        currentFilters.splice(existingIndex, 1)
      }
    } else {
      if (existingIndex >= 0) {
        currentFilters[existingIndex] = newFilter
      } else {
        currentFilters.push(newFilter)
      }
    }
    
    updateFilter('char_filters', currentFilters)
  }
  
  function removeCharacteristicFilter(filterId: string) {
    const currentFilters = filters.value.char_filters.filter(f => f.filter !== filterId)
    updateFilter('char_filters', currentFilters)
  }
  
  function removeActiveFilter(filterId: string, filterType: string) {
    switch (filterType) {
      case 'search':
        updateFilter('search', '')
        break
      case 'price':
        updateFilter('min_price', '')
        updateFilter('max_price', '')
        break
      case 'characteristic':
        const filterIdNumber = filterId.split('_')[1]
        removeCharacteristicFilter(filterIdNumber)
        break
      case 'category':
        updateFilter('category_id', '')
        break
    }
  }
  
  function resetAllFilters() {
    router.push({ path: route.path })
  }
  
  function getApiParams(): ProductSearchParams {
    return {
      search: filters.value.search || undefined,
      category_id: filters.value.category_id,
      min_price: filters.value.min_price,
      max_price: filters.value.max_price,
      order_by: filters.value.order_by as any,
      order_direction: filters.value.order_direction,
      page: filters.value.page,
      limit: filters.value.limit,
      char_filters: filters.value.char_filters.length > 0 ? filters.value.char_filters : undefined
    }
  }
  
  return {
    filters,
    activeFilters,
    hasActiveFilters,
    updateFilter,
    updateCategory,
    addCharacteristicFilter,
    removeCharacteristicFilter,
    removeActiveFilter,
    resetAllFilters,
    getApiParams
  }
}