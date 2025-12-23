import Api from 'src/shared/api/Api.js'
import type { LogisticsOrder, LogisticsOrdersParams } from '../model/types'

export const oppLogisticsApi = {
  /**
   * Получить список логистических заказов для ПВЗ
   */
  async getLogisticsOrders(oppId: number, params?: LogisticsOrdersParams): Promise<LogisticsOrder[]> {
    try {
      const queryParams: Record<string, string> = {}

      if (params?.direction) {
        queryParams.direction = params.direction
      }

      const queryString = new URLSearchParams(queryParams).toString()
      const url = `/api/opp/${oppId}/logistics-orders${queryString ? '?' + queryString : ''}`

      const response = await Api.get(url)

      if (!response.data.success) {
        console.error('Failed to fetch logistics orders', response.data.error)
        return []
      }

      return response.data.data.logistics_orders || []
    } catch (error) {
      console.error('Error fetching logistics orders:', error)
      return []
    }
  }
}
