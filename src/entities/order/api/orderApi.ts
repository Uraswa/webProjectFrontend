import Api from 'src/shared/api/Api.js'

export interface OrderProduct {
  product_id: number
  order_id: number
  ordered_count: number
  price: string
  opp_received_count: number
  name: string
  photos: string | string[]
}

export interface OrderStatusHistoryItem {
  name: string
  time: string
}

export interface OrderData {
  order_id: number
  order_type: string
  receiver_id: number
  opp_id: number
  created_date: string
  received_date: string | null
  first_name: string
  last_name: string
  address: string
  latitude: number
  longitude: number
  current_status: string | null
  products: OrderProduct[]
  total: string
  status_history: OrderStatusHistoryItem[]
}

export interface OrderResponse {
  success: boolean
  data: OrderData
}

export interface CancelOrderResponse {
  success: boolean
  error?: string
}

export const orderApi = {
  async getOrder(orderId: number | string): Promise<OrderData> {
    try {
      const response = await Api.get(`/api/orders/${orderId}`)

      if (!response.data?.success) {
        throw new Error('Failed to fetch order data')
      }

      const orderData = response.data.data

      // Parse photos for each product
      const productsWithParsedPhotos = orderData.products.map((product: OrderProduct) => ({
        ...product,
        photos: this.parsePhotos(product.photos)
      }))

      return {
        ...orderData,
        products: productsWithParsedPhotos
      }

    } catch (error: any) {
      console.error('Error fetching order:', error.message)
      throw error
    }
  },

  async cancelOrder(orderId: number | string): Promise<CancelOrderResponse> {
    try {
      const response = await Api.post(`/api/orders/${orderId}/cancel`, {
        order_id: orderId
      })

      return {
        success: response.data.success,
        error: response.data.error
      }

    } catch (error: any) {
      console.error('Error cancelling order:', error)

      // Handle HTTP error responses
      if (error.response) {
        const status = error.response.status
        const errorData = error.response.data

        if (status === 404) {
          return {
            success: false,
            error: errorData.error || 'order_not_found'
          }
        }

        if (status === 500) {
          return {
            success: false,
            error: errorData.error || 'server_error'
          }
        }

        return {
          success: false,
          error: errorData.error || 'unknown_error'
        }
      }

      // Network or other errors
      return {
        success: false,
        error: 'network_error'
      }
    }
  },

  parsePhotos(photos: string | string[]): string[] {
    if (!photos) return []

    try {
      if (Array.isArray(photos)) {
        return photos
      }

      if (typeof photos === 'string') {
        const parsed = JSON.parse(photos)
        return Array.isArray(parsed) ? parsed : []
      }

      return []
    } catch (e) {
      console.warn('Failed to parse photos:', e)
      return []
    }
  }
}
