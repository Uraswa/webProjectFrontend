import Api from 'src/shared/api/Api.js' 
import type { ProductSearchParams, ProductSearchResponse } from '../model/types'
import { parseProductPhotos } from 'src/shared/utils/parsePhotos' // Импортируем из базы

export const productSearchApi = {
  async searchProducts(params: ProductSearchParams): Promise<ProductSearchResponse> {
    try {
      // Формируем query строку вручную
      const queryParams = new URLSearchParams()
      
      // Обязательные параметры с дефолтами
      queryParams.append('order_by', params.order_by || 'created_at')
      queryParams.append('order_direction', params.order_direction || 'desc')
      queryParams.append('page', String(params.page || 1))
      queryParams.append('limit', String(params.limit || 20))
      
      // Опциональные параметры
      if (params.search) queryParams.append('search', params.search)
      if (params.category_id) queryParams.append('category_id', String(params.category_id))
      if (params.shop_id) queryParams.append('shop_id', String(params.shop_id))
      if (params.min_price) queryParams.append('min_price', String(params.min_price))
      if (params.max_price) queryParams.append('max_price', String(params.max_price))
      if (params.char_filters && params.char_filters.length > 0) {
        queryParams.append('char_filters', JSON.stringify(params.char_filters))
      }
      
      const url = `/api/products/search?${queryParams.toString()}`
      const response = await Api.get(url)

      if (!response.data.success) {
        console.error('Product search failed', response.data)
        return {
          products: [],
          pagination: { page: 1, limit: 20, total: 0, total_pages: 0 }
        }
      }

      const { products, pagination } = response.data.data
      
      // АДАПТАЦИЯ: Парсим photos в соответствии с базовым интерфейсом
      const adaptedProducts = products.map((product: any) => ({
        ...product,
        photos: parseProductPhotos(product.photos) // Парсим строку в массив для совместимости
      }))

      return {
        products: adaptedProducts, // Теперь соответствует Product из базы
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