import Api from 'src/shared/api/Api.js'
import type { Opp } from '../model/types'

export const oppSelectionApi = {
  /**
   * Получить список ПВЗ текущего владельца
   */
  async getUserOpps(): Promise<Opp[]> {
    try {
      const response = await Api.get('/api/user/opps')

      if (!response.data.success) {
        console.error('Failed to fetch user OPPs', response.data.error)
        return []
      }

      return response.data.data || []
    } catch (error) {
      console.error('Error fetching user OPPs:', error)
      return []
    }
  }
}
