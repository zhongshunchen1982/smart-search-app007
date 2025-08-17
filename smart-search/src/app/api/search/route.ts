import { NextRequest, NextResponse } from 'next/server'
import { filterKeywords } from '@/lib/keywordFilter'
import { SearchResult } from '@/types/search'

// 带超时的fetch
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// 调用Google搜索API
async function callGoogleSearchAPI(query: string, apiKey: string, searchEngineId: string) {
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`
  
  try {
    const response = await fetchWithTimeout(url, {}, 6000) // 6秒超时
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message)
    }
    
    return data
  } catch (error) {
    throw error
  }
}

// 调用GLM处理结果
async function callGLMAPI(searchResults: SearchResult[], query: string, apiKey: string) {
  const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  
  // 前3个核心结果，后4个快速结果
  const coreResults = searchResults.slice(0, 3)
  const quickResults = searchResults.slice(3, 7)
  
  const prompt = `用户搜索：${query}

处理以下搜索结果：

核心结果：
${coreResults.map((item, index) => `${index + 1}. ${item.title}\n   ${item.snippet}`).join('\n\n')}

快速结果：
${quickResults.map((item, index) => `${index + 4}. ${item.title}\n   ${item.snippet}`).join('\n\n')}

返回JSON：
{
  "directAnswer": null,
  "coreResults": [
    {
      "title": "标题",
      "link": "链接",
      "snippet": "摘要",
      "summary": "50字摘要",
      "category": "类型",
      "relevanceScore": 评分
    }
  ],
  "quickResults": [
    {
      "title": "标题",
      "link": "链接",
      "snippet": "摘要",
      "summary": "30字摘要"
    }
  ],
  "relatedTopics": []  // 重要：不要生成任何相关搜索话题！
}`

  try {
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4.5',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 400
      })
    }, 10000) // 10秒超时

    if (!response.ok) {
      throw new Error(`GLM请求失败: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.choices && data.choices[0]) {
      const content = data.choices[0].message.content
      try {
        // 尝试清理markdown格式的JSON
        let cleanContent = content.trim()
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/```json\n?/, '').replace(/\n?```$/, '')
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/```\n?/, '').replace(/\n?```$/, '')
        }
        return JSON.parse(cleanContent)
      } catch {
        // 如果解析失败，返回原始结果
        return {
          directAnswer: null,
          coreResults: coreResults.map((item, index) => ({
            ...item,
            summary: item.snippet?.substring(0, 100) || item.title?.substring(0, 100) || "无摘要",
            category: "网页",
            relevanceScore: 9 - index
          })),
          quickResults: quickResults.map(item => ({
            ...item,
            summary: item.snippet?.substring(0, 50) || item.title?.substring(0, 50) || "无摘要"
          })),
          relatedTopics: []
        }
      }
    }
    
    throw new Error('GLM返回格式错误')
  } catch {
    // 如果GLM调用失败，返回原始结果
    return {
      directAnswer: null,
      coreResults: coreResults.map((item, index) => ({
        ...item,
        summary: item.snippet?.substring(0, 100) || item.title?.substring(0, 100) || "无摘要",
        category: "网页",
        relevanceScore: 9 - index
      })),
      quickResults: quickResults.map(item => ({
        ...item,
        summary: item.snippet?.substring(0, 50) || item.title?.substring(0, 50) || "无摘要"
      })),
      relatedTopics: []
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: '查询参数不能为空' }, { status: 400 })
    }

    // 验证环境变量
    const googleApiKey = process.env.GOOGLE_API_KEY
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID
    const glmApiKey = process.env.ZHIPUAI_API_KEY

    if (!googleApiKey || !searchEngineId || !glmApiKey) {
      console.error('Missing required environment variables:', {
        hasGoogleApiKey: !!googleApiKey,
        hasSearchEngineId: !!searchEngineId,
        hasGlmApiKey: !!glmApiKey
      })
      return NextResponse.json({ error: '服务配置错误，请联系管理员' }, { status: 500 })
    }

    const startTime = Date.now()

    // 第一步：关键词过滤
    const filteredQuery = filterKeywords(query)
    
    if (!filteredQuery) {
      return NextResponse.json({
        directAnswer: "您的内容包含敏感词汇，已被过滤。",
        coreResults: [],
        quickResults: [],
        relatedTopics: [],
        searchMetadata: {
          intent: "blocked",
          processingTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
          totalResults: 0
        }
      })
    }

    // 第二步：Google搜索
    const searchResults = await callGoogleSearchAPI(filteredQuery, googleApiKey, searchEngineId)
    
    if (!searchResults.items || searchResults.items.length === 0) {
      return NextResponse.json({
        directAnswer: "未找到相关搜索结果。",
        coreResults: [],
        quickResults: [],
        relatedTopics: [],
        searchMetadata: {
          intent: "informational",
          processingTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
          totalResults: 0
        }
      })
    }

    // 第三步：GLM处理结果
    const processedResults = await callGLMAPI(searchResults.items, filteredQuery, glmApiKey)

    const processingTime = `${((Date.now() - startTime) / 1000).toFixed(1)}s`

    return NextResponse.json({
      ...processedResults,
      searchMetadata: {
        intent: "informational",
        originalQuery: query,
        optimizedQuery: filteredQuery,
        processingTime,
        totalResults: searchResults.searchInformation?.totalResults || searchResults.items.length
      }
    })

  } catch (error) {
    console.error('搜索处理失败:', error)
    return NextResponse.json(
      { error: '搜索服务暂时不可用，请稍后重试' },
      { status: 500 }
    )
  }
}