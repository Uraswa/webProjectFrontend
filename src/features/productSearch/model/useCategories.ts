// features/productSearch/model/useCategories.ts
import { ref, computed, watch } from 'vue'
import { categoriesApi } from '../api/categoriesApi'
import type { Category, CharacteristicFilter } from './types'

export function useCategories() {
  const categories = ref<Category[]>([])
  const characteristicFilters = ref<CharacteristicFilter[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Загрузить все категории
  const loadCategories = async () => {
    try {
      loading.value = true
      error.value = null
      
      const data = await categoriesApi.getAllCategories()
      categories.value = data
      
      console.log('✅ [useCategories] Категории загружены:', data.length)
      
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки категорий'
      console.error('❌ [useCategories] Ошибка загрузки категорий:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Загрузить фильтры для категории
  const loadFilters = async (categoryId?: number) => {
    try {
      loading.value = true
      error.value = null
      characteristicFilters.value = [] // Очищаем перед загрузкой
      
      console.log('🔄 [useCategories] Начинаем загрузку фильтров для категории:', categoryId)
      
      if (!categoryId) {
        console.log('ℹ️ [useCategories] categoryId не указан, возвращаем пустой массив')
        characteristicFilters.value = []
        return
      }
      
      const data = await categoriesApi.getFilters(categoryId)
      
      console.log('✅ [useCategories] Фильтры загружены:', {
        categoryId,
        count: data.length,
        filters: data
      })
      
      characteristicFilters.value = data
      
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки фильтров'
      console.error('❌ [useCategories] Ошибка загрузки фильтров:', {
        categoryId,
        message: err.message,
        stack: err.stack
      })
      characteristicFilters.value = [] // При ошибке очищаем
    } finally {
      loading.value = false
    }
  }
  
  // Древовидная структура категорий
  const categoryTree = computed(() => {
    const map = new Map<number, Category>()
    const roots: Category[] = []
    
    // Создаем карту категорий
    categories.value.forEach(cat => {
      map.set(cat.category_id, { ...cat, children: [] })
    })
    
    // Строим дерево
    categories.value.forEach(cat => {
      const node = map.get(cat.category_id)!
      
      if (cat.parent_category_id && map.has(cat.parent_category_id)) {
        const parent = map.get(cat.parent_category_id)!
        parent.children!.push(node)
      } else {
        roots.push(node)
      }
    })
    
    return roots
  })
  
  // Плоский список категорий для селекта
  const flatCategories = computed(() => {
    const flatten = (cats: Category[], depth = 0): (Category & { depth: number })[] => {
      return cats.reduce((acc, cat) => {
        acc.push({ ...cat, depth })
        if (cat.children && cat.children.length > 0) {
          acc.push(...flatten(cat.children, depth + 1))
        }
        return acc
      }, [] as (Category & { depth: number })[])
    }
    
    return flatten(categoryTree.value)
  })
  
  // Ищем категорию по ID
  const findCategoryById = (id: number): Category | undefined => {
    return categories.value.find(cat => cat.category_id === id)
  }
  
  return {
    categories,
    characteristicFilters,
    categoryTree,
    flatCategories,
    loading,
    error,
    loadCategories,
    loadFilters,
    findCategoryById
  }
}