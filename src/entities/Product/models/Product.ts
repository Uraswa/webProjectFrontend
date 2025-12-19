// src/entities/Product/models/Product.ts
export interface Product {
  product_id: number
  category_id: number
  shop_id: number
  name: string
  description: string
  photos: string[] | string
  price: string
  created_at: string
  category_name: string
  shop_name: string
  characteristics?: Record<string, any>
}