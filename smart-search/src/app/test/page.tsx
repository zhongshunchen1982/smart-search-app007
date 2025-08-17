'use client'

import { useState } from 'react'

export default function TestPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [testQuery, setTestQuery] = useState('')

  const testKeywordFilter = async () => {
    const queries = [
      '周也 台湾男朋友',
      '大陆 相关内容',
      '周也 个人信息',
      '台湾'
    ]

    console.log('=== 关键词过滤测试 ===')
    for (const query of queries) {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await response.json()
      console.log(`查询: "${query}"`)
      console.log('结果:', data.directAnswer || '通过过滤')
      console.log('---')
    }
  }

  const testSearchFlow = async () => {
    if (!testQuery) return
    setLoading(true)
    
    try {
      const startTime = Date.now()
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery })
      })
      
      const data = await response.json()
      const endTime = Date.now()
      
      setResults({
        ...data,
        testInfo: {
          query: testQuery,
          totalTime: `${((endTime - startTime) / 1000).toFixed(2)}s`
        }
      })
      
      console.log('=== 搜索流程测试 ===')
      console.log('原始查询:', testQuery)
      console.log('搜索结果:', data)
      
    } catch (error) {
      console.error('测试失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">搜索系统测试</h1>
        
        {/* 关键词过滤测试 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">关键词过滤测试</h2>
          <button 
            onClick={testKeywordFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            运行关键词过滤测试
          </button>
          <p className="text-sm text-gray-600 mt-2">查看控制台输出</p>
        </div>

        {/* 搜索流程测试 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">搜索流程测试</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="输入测试查询..."
              className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={testSearchFlow}
              disabled={loading || !testQuery}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试搜索'}
            </button>
          </div>
          
          {/* 预设测试用例 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">快速测试:</p>
            <div className="flex flex-wrap gap-2">
              {['周也 个人信息', '最新科技新闻', '如何学习编程'].map((query) => (
                <button
                  key={query}
                  onClick={() => setTestQuery(query)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 测试结果 */}
        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">测试结果</h2>
            {results.testInfo && (
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <p><strong>查询:</strong> {results.testInfo.query}</p>
                <p><strong>总耗时:</strong> {results.testInfo.totalTime}</p>
                <p><strong>搜索意图:</strong> {results.searchMetadata?.intent}</p>
                {results.searchMetadata?.originalQuery !== results.searchMetadata?.optimizedQuery && (
                  <p><strong>查询优化:</strong> "{results.searchMetadata.originalQuery}" → "{results.searchMetadata.optimizedQuery}"</p>
                )}
              </div>
            )}
            
            {results.directAnswer && (
              <div className="mb-4 p-3 bg-green-50 rounded">
                <h3 className="font-medium mb-2">AI回答:</h3>
                <p>{results.directAnswer}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="font-medium">核心结果 ({results.coreResults?.length || 0})</h3>
              {results.coreResults?.slice(0, 3).map((result: any, index: number) => (
                <div key={index} className="border rounded p-3">
                  <h4 className="font-medium text-blue-600">{result.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{result.summary || result.snippet}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{result.category}</span>
                    <span className="text-xs text-gray-500">相关性: {result.relevanceScore}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}