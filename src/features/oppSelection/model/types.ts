export interface Opp {
  opp_id: number
  name: string
  address: string
  working_hours?: string
  owner_id: number
  phone?: string
  created_at?: string
}

export interface OppSelectionResponse {
  success: boolean
  data: Opp[]
  error?: string
}
