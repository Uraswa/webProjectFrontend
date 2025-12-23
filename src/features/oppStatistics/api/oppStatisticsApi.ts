import Api from 'src/shared/api/Api.js'
import type { OppStatistics } from '../model/types'

export const oppStatisticsApi = {
  /**
   * Получить статистику для ПВЗ
   */
  async getStatistics(oppId: number): Promise<OppStatistics | null> {
    try {
      const response = await Api.get(`/api/opp/${oppId}/statistics`)

      if (!response.data.success) {
        console.error('Failed to fetch statistics', response.data.error)
        return null
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching OPP statistics:', error)
      return null
    }
  }
}
