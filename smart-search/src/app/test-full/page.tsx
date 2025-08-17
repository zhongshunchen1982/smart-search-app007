'use client'

import { useState, useEffect } from 'react'

export default function FullTestPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  const testFullSearch = async () => {
    if (!query.trim()) {
      setError('请输入搜索内容')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '搜索失败')
      }
      
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索失败')
    } finally {
      setLoading(false)
    }
  }

  // 更新本地时间
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const dateStr = now.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      })
      setCurrentDate(dateStr)
    }

    // 立即更新一次
    updateDateTime()
    
    // 每分钟更新一次（处理日期变化）
    const interval = setInterval(updateDateTime, 60000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <div className="text-sm text-gray-600">
            {currentDate}
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">前度智能搜索 - 完整功能测试</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入搜索关键词..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && testFullSearch()}
            />
            <button
              onClick={testFullSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '搜索中...' : '搜索'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3">正在搜索并AI分析中...</span>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* 直接答案 */}
            {results.directAnswer && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-900 mb-2">AI直接回答：</h3>
                <p className="text-blue-800">{results.directAnswer}</p>
              </div>
            )}

            {/* 搜索元数据 */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex gap-6 text-sm text-gray-600">
                <span>搜索意图: {results.searchMetadata?.intent}</span>
                <span>处理时间: {results.searchMetadata?.processingTime}</span>
                <span>结果总数: {results.searchMetadata?.totalResults}</span>
              </div>
            </div>

            {/* 核心结果 */}
            <div>
              <h2 className="text-2xl font-bold mb-4">核心结果</h2>
              <div className="grid gap-4">
                {results.coreResults?.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 hover-lift">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-blue-600">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{item.summary}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>相关性: {item.relevanceScore}/10</span>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        查看原文 →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 快速浏览 */}
            <div>
              <h2 className="text-2xl font-bold mb-4">快速浏览</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.quickResults?.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 hover-lift">
                    <h3 className="font-semibold mb-2">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {item.title}
                      </a>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            </div>
        )}
      </div>
    </div>
  )
}