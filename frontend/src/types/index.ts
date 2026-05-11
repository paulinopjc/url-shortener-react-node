export interface Url {
  id: number
  code: string
  original_url: string
  title: string | null
  created_at: string
  click_count: number
}

export interface ClickStats {
  total_clicks: number
  clicks_today: number
  top_referrers: { referrer: string; count: number }[]
  clicks_per_day: { date: string; count: number }[]
}

export interface CreateUrlInput {
  original_url: string
  title?: string
  custom_code?: string
}

export interface ApiResponse<T> {
  data: T
  count?: number
  error?: string
}
