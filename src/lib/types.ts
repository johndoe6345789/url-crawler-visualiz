export interface URLNode {
  id: string
  url: string
  status: 'pending' | 'loading' | 'success' | 'error'
  depth: number
  parentId: string | null
  data?: any
  error?: string
  responseTime?: number
  discoveredUrls: string[]
}

export interface URLEdge {
  source: string
  target: string
}

export interface CrawlStats {
  total: number
  pending: number
  loading: number
  success: number
  error: number
}
