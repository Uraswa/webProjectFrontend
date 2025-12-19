// src/features/productDetails/api/productDetailsApi.ts
import Api from 'src/shared/api/Api.js'
import { parseProductPhotos } from 'src/shared/utils/parsePhotos'

export interface ProductReview {
  user_id: number
  product_id: number
  rate: number
  good_text: string | null
  bad_text: string | null
  comment: string | null
  created_at: string
  first_name: string
  last_name: string
}

export interface ProductRating {
  total_reviews: string
  average_rating: string
}

export const productDetailsApi = {
  async getProductDetails(productId: number) {
    try {
      console.log(`📡 Загружаем товар ID: ${productId}`)
      
      // Пробуем реальный API
      const response = await Api.get(`/api/products/${productId}`)
      
      console.log('✅ Ответ API получен:', response.data)
      
      if (!response.data?.success) {
        console.error('Product details API failed:', response.data)
        return this.createMockProduct(productId)
      }

      const { product, feedback, rating } = response.data.data
      
      console.log('📦 Товар получен:', product.name)
      console.log('📸 Фото raw:', product.photos)
      
      // БЕЗОПАСНЫЙ парсинг фотографий и характеристик
      const productWithParsedData = {
        ...product,
        photos: parseProductPhotos(product.photos),
        characteristics: this.parseCharacteristics(product.characteristics)
      }

      return {
        product: productWithParsedData,
        feedback: feedback || [],
        rating: rating || { total_reviews: '0', average_rating: '0' }
      }
      
    } catch (error: any) {
      console.error('❌ Ошибка в productDetailsApi:', error.message)
      console.log('ℹ️ Используем тестовые данные')
      
      // Создаем тестовые данные для разработки
      return this.createMockProduct(productId)
    }
  },

  // Безопасный парсинг характеристик
  parseCharacteristics(characteristics: any): Record<string, any> {
    if (!characteristics) return {}
    
    try {
      // Если уже объект
      if (typeof characteristics === 'object' && characteristics !== null) {
        return characteristics
      }
      
      // Если строка JSON
      if (typeof characteristics === 'string') {
        return JSON.parse(characteristics)
      }
      
      return {}
    } catch (e) {
      console.warn('⚠️ Не удалось распарсить характеристики:', e)
      return {}
    }
  },

  // Тестовые данные пока API не работает
  createMockProduct(productId: number) {
    console.log('🛠️ Используем тестовые данные для ID:', productId)
    
    return {
      product: {
        product_id: productId,
        category_id: 1,
        shop_id: 1,
        name: `Тестовый товар ${productId}`,
        description: 'Это описание тестового товара для разработки. Реальные данные будут загружены когда API заработает.',
        photos: ['/placeholder.png'], // Локальный плейсхолдер
        price: (productId * 1000).toFixed(2),
        created_at: new Date().toISOString(),
        category_name: 'Тестовая категория',
        shop_name: 'Тестовый магазин',
        characteristics: {
          '1': 'XL',
          '2': 'Красный',
          'custom_char_Материал': 'Хлопок 100%',
          'custom_char_Производитель': 'TestBrand'
        }
      },
      feedback: [
        {
          user_id: 1,
          product_id: productId,
          rate: 5,
          good_text: 'Отличное качество',
          bad_text: null,
          comment: 'Рекомендую к покупке',
          created_at: new Date().toISOString(),
          first_name: 'Иван',
          last_name: 'Петров'
        },
        {
          user_id: 2,
          product_id: productId,
          rate: 4,
          good_text: 'Быстрая доставка',
          bad_text: 'Немного маломерит',
          comment: 'В целом доволен покупкой',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          first_name: 'Мария',
          last_name: 'Сидорова'
        }
      ],
      rating: {
        total_reviews: '2',
        average_rating: '4.5'
      }
    }
  }
}