import Api from 'src/shared/api/Api.js'
import type {
  ReceiveFromSellerPayload,
  GiveToLogisticsPayload,
  ReceiveFromLogisticsPayload,
  DeliverPayload,
  OperationResponse
} from '../model/types'

export const oppOperationsApi = {
  /**
   * Приём товара от продавца
   */
  async receiveFromSeller(oppId: number, payload: ReceiveFromSellerPayload): Promise<OperationResponse> {
    try {
      const response = await Api.post(`/api/opp/${oppId}/receive-from-seller`, payload)
      return response.data
    } catch (error) {
      console.error('Error receiving from seller:', error)
      return { success: false, error: 'network_error' }
    }
  },

  /**
   * Передача товара логистике
   */
  async giveToLogistics(oppId: number, payload: GiveToLogisticsPayload): Promise<OperationResponse> {
    try {
      const response = await Api.post(`/api/opp/${oppId}/give-to-logistics`, payload)
      return response.data
    } catch (error) {
      console.error('Error giving to logistics:', error)
      return { success: false, error: 'network_error' }
    }
  },

  /**
   * Приём товара от логистики
   */
  async receiveFromLogistics(oppId: number, payload: ReceiveFromLogisticsPayload): Promise<OperationResponse> {
    try {
      const response = await Api.post(`/api/opp/${oppId}/receive-from-logistics`, payload)
      return response.data
    } catch (error) {
      console.error('Error receiving from logistics:', error)
      return { success: false, error: 'network_error' }
    }
  },

  /**
   * Выдача товара покупателю
   */
  async deliver(oppId: number, payload: DeliverPayload): Promise<OperationResponse> {
    try {
      const response = await Api.post(`/api/opp/${oppId}/deliver`, payload)
      return response.data
    } catch (error) {
      console.error('Error delivering to buyer:', error)
      return { success: false, error: 'network_error' }
    }
  }
}
