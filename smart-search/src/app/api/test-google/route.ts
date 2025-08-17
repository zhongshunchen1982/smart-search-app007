import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    const apiKey = 'AIzaSyDR_4UgdroZ4EFmMZgM00PSNsDNT3cK2W8'
    const searchEngineId = 'f697a2564c8464c35'
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API测试失败:', error)
    return NextResponse.json({ error: 'API调用失败' }, { status: 500 })
  }
}