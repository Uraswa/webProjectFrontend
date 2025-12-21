// entities/product/model/types.ts
export interface Product {
  product_id: number
  category_id: number
  shop_id: number
  name: string
  description: string
  photos: string[] | string// JSON парсим
  price: string
  created_at: string
  count?: number // Остаток на складе
  variant_group_id?: number | null
  variant?: string[] // JSON массив вариантов
  characteristics?: Record<string, any> // JSON объект характеристик
  category_name?: string // Join поле
  shop_name?: string // Join поле
}