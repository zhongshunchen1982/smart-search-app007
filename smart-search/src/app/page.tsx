'use client'

import { useState, useEffect } from 'react'
import SearchResults from '@/components/SearchResults'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentDate, setCurrentDate] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setShowResults(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('搜索失败:', error)
      setResults({
        directAnswer: '搜索服务暂时不可用，请稍后重试。',
        coreResults: [],
        quickResults: [],
        relatedTopics: [],
        searchMetadata: {
          intent: 'error',
          processingTime: '0s',
          totalResults: 0
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBackToSearch = () => {
    setShowResults(false)
    setResults(null)
    setQuery('')
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

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleBackToSearch}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入搜索关键词..."
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    极搜一下
                  </button>
                </form>
              </div>
            </div>

            {loading ? (
              <div className="mt-8">
                <LoadingSpinner />
              </div>
            ) : results ? (
              <div className="animate-fadeIn">
                <SearchResults results={results} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* 顶部导航 */}
      <header className="py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-end items-center">
          <div className="text-sm text-gray-600">
            {currentDate}
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4 tracking-tight">
            极搜
          </h1>
          <p className="text-xl text-gray-600">极简搜索，精准直达</p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors shadow-lg"
              placeholder="输入关键词，开始搜索..."
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-8 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '搜索中...' : '搜索'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-sm text-gray-500">
          <p>AI 驱动的极简搜索引擎。无广告、不追踪，为你筛选最优质的内容！</p>
        </div>
      </main>

      {/* 底部 */}
      <footer className="py-6 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-6 mb-2">
          <a href="#" className="hover:text-gray-700 transition-colors">关于极搜</a>
          <a href="#" className="hover:text-gray-700 transition-colors">使用协议</a>
          <a href="#" className="hover:text-gray-700 transition-colors">隐私政策</a>
          <a href="#" className="hover:text-gray-700 transition-colors">意见反馈</a>
        </div>
        <p>©2025 极搜 - 极简智能搜索</p>
        <p className="text-xs mt-2 text-gray-400">开发者：陈中顺 孙殿</p>
      </footer>
    </div>
  )
}