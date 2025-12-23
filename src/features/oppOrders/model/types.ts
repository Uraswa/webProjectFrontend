export interface Product {
  product_id: number
  name: string
  photo: string
  quantity: number
  price: string
}

export interface OppOrder {
  order_id: number
  total_sum: string
  status: 'packing' | 'shipping' | 'waiting' | 'done' | 'canceled'
  created_at: string
  seller_name: string
  pickup_address: string
  products: Product[]
}

export interface StatusHistoryItem {
  status: string
  timestamp: string
  comment?: string
}

export interface OppOrderDetail extends OppOrder {
  buyer_name: string
  buyer_phone: string
  status_history: StatusHistoryItem[]
}

export interface OrdersParams {
  status?: 'packing' | 'shipping' | 'waiting' | 'done' | 'canceled'
}

export interface OrdersResponse {
  success: boolean
  data: {
    orders: OppOrder[]
    count: number
  }
  error?: string
}

export interface OrderDetailResponse {
  success: boolean
  data: OppOrderDetail
  error?: string
}
