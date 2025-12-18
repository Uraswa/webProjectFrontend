// frontend/src/features/productSearch/api/productSearchApi.ts
import Api from 'src/shared/api/Api.js' // ✅ правильный импорт
import type { ProductSearchParams, ProductSearchResponse, Pagination } from '../model/types'

export const productSearchApi = {
  async searchProducts(params: ProductSearchParams): Promise<ProductSearchResponse> {
    try {
      // формируем query-параметры с дефолтами
      const query: Record<string, any> = {
        order_by: params.order_by || 'created_at',
        order_direction: params.order_direction || 'desc',
        page: params.page || 1,
        limit: params.limit || 20,
      }

      if (params.search) query.search = params.search // не отправляем пустой search
      if (params.category_id) query.category_id = params.category_id
      if (params.shop_id) query.shop_id = params.shop_id
      if (params.min_price) query.min_price = params.min_price
      if (params.max_price) query.max_price = params.max_price

      // формируем query-строку вручную
      const queryString = new URLSearchParams(query).toString()

      // GET-запрос
      const response = await Api.get(`/api/products/search?${queryString}`)

      if (!response.data.success) {
        console.error('Product search failed', response.data)
        return {
          products: [],
          pagination: { page: 1, limit: 20, total: 0, total_pages: 0 }
        }
      }

      const { products, pagination } = response.data.data

      return {
        products,
        pagination
      }
    } catch (error) {
      console.error('Error in productSearchApi.searchProducts:', error)
      return {
        products: [],
        pagination: { page: 1, limit: 20, total: 0, total_pages: 0 }
      }
    }
  }
}
