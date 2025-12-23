import Api from 'src/shared/api/Api.js'
import type { Opp } from '../model/types'

export const oppSelectionApi = {
  /**
   * Получить список ПВЗ текущего владельца
   */
  async getUserOpps(): Promise<Opp[]> {
    try {
      const response = await Api.get('/api/user/opp')

      if (!response.data.success) {
        console.error('Failed to fetch user OPPs', response.data.error)
        return []
      }

      const payload = response.data?.data
      const opps = Array.isArray(payload) ? payload : (payload?.opps || [])
      return Array.isArray(opps) ? opps : []
    } catch (error) {
      console.error('Error fetching user OPPs:', error)
      return []
    }
  }
}
