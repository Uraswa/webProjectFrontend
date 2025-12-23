export interface OppStatistics {
  total_orders: number
  active_orders: number
  completed_orders?: number
  canceled_orders?: number
  waiting_receipt?: number
  total_revenue?: string
  [key: string]: any
}

export interface StatisticsResponse {
  success: boolean
  data: OppStatistics
  error?: string
}
