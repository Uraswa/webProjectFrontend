import type { Product } from 'src/features/oppOrders/model/types'

export interface LogisticsOrder {
  logistics_order_id: number
  direction: 'incoming' | 'outgoing'
  products: Product[]
  total_quantity: number
  status: string
  created_at: string
  from_opp?: string
  to_opp?: string
}

export interface LogisticsOrdersParams {
  direction?: 'all' | 'incoming' | 'outgoing'
}

export interface LogisticsOrdersResponse {
  success: boolean
  data: {
    logistics_orders: LogisticsOrder[]
    count: number
    direction: string
  }
  error?: string
}
