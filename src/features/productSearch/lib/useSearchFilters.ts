import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

export function useSearchFilters() {
  const route = useRoute()
  const router = useRouter()
  
  // 1. Получаем фильтры из URL
  const filters = computed(() => ({
    search: route.query.search as string || '',
    category_id: route.query.category_id ? Number(route.query.category_id) : undefined,
    min_price: route.query.min_price ? Number(route.query.min_price) : undefined,
    max_price: route.query.max_price ? Number(route.query.max_price) : undefined,
    page: route.query.page ? Number(route.query.page) : 1,
    limit: 20
  }))
  
  // 2. Функция обновления URL
  function updateFilter(key: string, value: any) {
    const query = { ...route.query }
    
    if (value === undefined || value === '' || value === null) {
      delete query[key]
    } else {
      query[key] = String(value)
    }
    
    // Всегда сбрасываем на первую страницу при изменении фильтров
    if (key !== 'page') {
      query.page = '1'
    }
    
    router.push({ query })
  }
  
  // 3. Форматируем для API
  function getApiParams() {
    return {
      search: filters.value.search || undefined,
      category_id: filters.value.category_id,
      min_price: filters.value.min_price,
      max_price: filters.value.max_price,
      page: filters.value.page,
      limit: filters.value.limit
    }
  }
  
  return {
    filters,
    updateFilter,
    getApiParams
  }
}