// features/productSearch/model/types.ts
import { Product } from 'src/entities/Product/models/Product'

/** Параметры поиска товаров */
export interface ProductSearchParams {
  search?: string
  category_id?: number
  shop_id?: number
  min_price?: number
  max_price?: number
  order_by?: 'name' | 'price' | 'created_at'
  order_direction?: 'asc' | 'desc'
  page?: number
  limit?: number
  char_filters?: Array<{
    filter: string  // ID характеристики как строка
    value?: string  // Для options/color/bool (одиночное значение)
    values?: string[] // Для multiple options (массив значений)
    min?: string    // Для int/float
    max?: string    // Для int/float
  }>
}
/** Пагинация */
export interface Pagination {
  page: number
  limit: number
  total: number
  total_pages: number
}

/** Ответ поиска */
export interface ProductSearchResponse {
  products: Product[]
  pagination: Pagination
}

/** Категория */
export interface Category {
  category_id: number
  parent_category_id: number | null
  name: string
  children?: Category[]
}

/** Фильтр характеристики */
export interface CharacteristicFilter {
  id: number
  name: string
  type: 'int' | 'float' | 'bool' | 'options' | 'color'
  data: {
    min_value?: number
    max_value?: number
    options?: string[]
    unit?: string
    // Другие возможные поля
    [key: string]: any
  }
  // Опциональные поля для отладки
  _original?: any
}

/** Активный фильтр для отображения */
export interface ActiveFilter {
  id: string
  type: 'category' | 'price' | 'characteristic' | 'search'
  label: string
  value: any
}