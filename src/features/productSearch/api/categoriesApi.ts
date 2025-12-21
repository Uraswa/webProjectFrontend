// features/productSearch/api/categoriesApi.ts
import Api from 'src/shared/api/Api'
import type { CharacteristicFilter } from '../model/types'

export const categoriesApi = {
  // Получить все категории
  async getAllCategories() {
    try {
      const response = await Api.get('/api/categories')
      
      if (!response.data.success) {
        throw new Error('Не удалось загрузить категории')
      }
      
      return response.data.data.categories || []
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error)
      throw error
    }
  },
  
  // Получить фильтры для категории
  async getFilters(categoryId?: number): Promise<CharacteristicFilter[]> {
    try {
      // Используем query параметры напрямую в URL
      const url = categoryId 
        ? `/api/categories/getFilters?category_id=${categoryId}`
        : '/api/categories/getFilters'
      
      console.log('📡 [categoriesApi] Запрашиваем фильтры по URL:', url)
      
      const response = await Api.get(url)
      
      if (!response.data.success) {
        console.error('❌ [categoriesApi] Сервер вернул success: false')
        throw new Error('Не удалось загрузить фильтры')
      }
      
      const backendData = response.data.data || []
      console.log('📦 [categoriesApi] Получены данные:', {
        count: backendData.length,
        firstItem: backendData[0]
      })
      
      // Трансформируем данные из бекенда во фронтендный формат
      const transformed = backendData.map((item: any) => {
        // Парсим data если это строка
        let parsedData = item.data
        if (typeof parsedData === 'string') {
          try {
            parsedData = JSON.parse(parsedData)
          } catch (e) {
            console.warn('⚠️ Не удалось распарсить data:', item.data)
            parsedData = {}
          }
        }
        
        return {
          id: item.characteristic_id || item.id, // берем characteristic_id из бекенда
          name: item.name,
          type: item.type,
          data: parsedData,
          // Сохраняем оригинальные поля для отладки
          _original: item
        }
      })
      
      console.log('🔄 [categoriesApi] Трансформированные фильтры:', transformed)
      return transformed
      
    } catch (error: any) {
      console.error('❌ [categoriesApi] Ошибка загрузки фильтров:', {
        message: error.message,
        response: error.response?.data,
        url: error.config?.url
      })
      throw error
    }
  }
}