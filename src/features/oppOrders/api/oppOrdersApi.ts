import Api from 'src/shared/api/Api.js'
import type { OppOrder, OppOrderDetail, OrdersParams } from '../model/types'

export const oppOrdersApi = {
  /**
   * Получить список заказов для ПВЗ с фильтрами
   */
  async getOrders(oppId: number, params?: OrdersParams): Promise<OppOrder[]> {
    try {
      const queryParams: Record<string, string> = {}

      if (params?.status) {
        queryParams.status = params.status
      }

      const queryString = new URLSearchParams(queryParams).toString()
      const url = `/api/opp/${oppId}/orders${queryString ? '?' + queryString : ''}`

      const response = await Api.get(url)

      if (!response.data.success) {
        console.error('Failed to fetch orders', response.data.error)
        return []
      }

      return response.data.data.orders || []
    } catch (error) {
      console.error('Error fetching OPP orders:', error)
      return []
    }
  },

  /**
   * Получить детали конкретного заказа
   */
  async getOrderDetails(oppId: number, orderId: number): Promise<OppOrderDetail | null> {
    try {
      const response = await Api.get(`/api/opp/${oppId}/orders/${orderId}`)

      if (!response.data.success) {
        console.error('Order not found', response.data.error)
        return null
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching order details:', error)
      return null
    }
  }
}
