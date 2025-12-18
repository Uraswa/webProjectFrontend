export interface ReceiveFromSellerPayload {
  order_id: number
  product_id: number
  count: number
}

export interface GiveToLogisticsPayload {
  order_id: number
  logistics_order_id: number
  product_id: number
  count: number
}

export interface ReceiveFromLogisticsPayload {
  logistics_order_id: number
}

export interface RejectedProduct {
  product_id: number
  count: number
  reason?: string
}

export interface DeliverPayload {
  order_id: number
  rejected_products?: RejectedProduct[]
}

export interface OperationResponse {
  success: boolean
  data?: any
  error?: string
  meta?: any
}
