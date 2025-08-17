'use client'

interface SearchResult {
  title: string
  link: string
  snippet: string
  summary?: string
  category?: string
  relevanceScore?: number
}

interface SearchResultsProps {
  results: {
    directAnswer?: string
    coreResults: SearchResult[]
    quickResults: SearchResult[]
    searchMetadata?: {
      intent: string
      processingTime: string
      totalResults: number
      originalQuery?: string
      optimizedQuery?: string
    }
  }
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">没有找到相关结果</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 直接答案 */}
      {results.directAnswer && (
        <div className="animate-slideUp bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">AI 回答</h3>
              <p className="text-blue-800">{results.directAnswer}</p>
            </div>
          </div>
        </div>
      )}

      {/* 核心结果 */}
      <div className="animate-slideUp animate-delay-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          核心结果
        </h2>
        <div className="space-y-6">
          {results.coreResults.map((result, index) => (
            <div key={index} className="animate-slideUp" style={{ animationDelay: `${100 + index * 100}ms` }}>
              <ResultCard result={result} isCore={true} />
            </div>
          ))}
        </div>
      </div>

      {/* 快速浏览 */}
      {results.quickResults && results.quickResults.length > 0 && (
        <div className="animate-slideUp animate-delay-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            快速浏览
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.quickResults.map((result, index) => (
              <div key={index} className="animate-slideUp" style={{ animationDelay: `${200 + index * 50}ms` }}>
                <ResultCard result={result} isCore={false} />
              </div>
            ))}
          </div>
        </div>
      )}

  
      {/* 搜索元信息 */}
      {results.searchMetadata && (
        <div className="animate-slideUp animate-delay-400 mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="space-y-2">
            {/* 显示查询优化信息 */}
            {results.searchMetadata.originalQuery !== results.searchMetadata.optimizedQuery && (
              <div className="bg-blue-50 inline-block px-3 py-1 rounded-full text-blue-700">
                <span className="font-medium">已优化查询：</span>
                "{results.searchMetadata.originalQuery}" → "{results.searchMetadata.optimizedQuery}"
              </div>
            )}
            <p className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              搜索用时: {results.searchMetadata.processingTime} | 
              共找到 {results.searchMetadata.totalResults} 个结果
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ResultCard({ result, isCore }: { result: SearchResult; isCore: boolean }) {
  return (
    <div
      className={`bg-white rounded-lg border p-6 hover-lift ${
        isCore ? 'shadow-sm border-blue-100' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <a
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline line-clamp-2 transition-colors"
        >
          {result.title}
        </a>
        {result.category && (
          <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
            {result.category}
          </span>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {result.summary || result.snippet}
      </p>
      
      <div className="flex items-center justify-between">
        <a
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {new URL(result.link).hostname}
        </a>
        {result.relevanceScore && (
          <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded">
            <span className="text-xs text-gray-500">相关性</span>
            <div className="flex items-center gap-1">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${result.relevanceScore * 10}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-700">{result.relevanceScore}/10</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}