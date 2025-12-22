// features/productDetails/api/characteristicsApi.ts -->
import Api from 'src/shared/api/Api.js'

export const characteristicsApi = {
  async getCharacteristicNames(ids: number[]) {
    if (!ids.length) return {}
    
    try {
      const response = await Api.get(`/api/characteristics/names?ids=${ids.join(',')}`)
      
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
      return {}
      
    } catch (error) {
      console.warn('Не удалось загрузить названия характеристик')
      return {}
    }
  }
}