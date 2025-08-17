// 搜索结果类型定义
export interface SearchResult {
  title: string
  link: string
  snippet: string
  summary?: string
  category?: string
  relevanceScore?: number
}

// 搜索响应类型定义
export interface SearchResponse {
  directAnswer?: string
  coreResults: SearchResult[]
  quickResults: SearchResult[]
  relatedTopics?: string[]
  searchMetadata?: {
    intent: string
    processingTime: string
    totalResults: number
    originalQuery?: string
    optimizedQuery?: string
  }
}