import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    // 从环境变量获取 API 密钥
    const apiKey = process.env.GOOGLE_API_KEY
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID
    
    if (!apiKey || !searchEngineId) {
      return NextResponse.json({ 
        error: 'Google API 配置缺失',
        details: '请在 Vercel 环境变量中配置 GOOGLE_API_KEY 和 GOOGLE_SEARCH_ENGINE_ID'
      }, { status: 500 })
    }
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API测试失败:', error)
    return NextResponse.json({ error: 'API调用失败' }, { status: 500 })
  }
}