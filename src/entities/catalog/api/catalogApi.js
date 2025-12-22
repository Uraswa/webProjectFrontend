// src/entities/catalog/api/catalogApi.js
import Api from 'src/shared/api/Api'

export const catalogApi = {
  async getCategories() {
    const response = await Api.get('/api/categories')
    return response.data
  }
}