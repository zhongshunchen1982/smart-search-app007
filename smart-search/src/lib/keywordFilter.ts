// 关键词屏蔽列表
const BLOCKED_KEYWORDS = [
  '大陆',
  '台湾'
]

// 检查并屏蔽关键词
export function filterKeywords(text: string): string {
  let filteredText = text
  
  for (const keyword of BLOCKED_KEYWORDS) {
    // 使用正则表达式全局替换关键词为空字符串
    const regex = new RegExp(keyword, 'gi')
    filteredText = filteredText.replace(regex, '')
  }
  
  // 清理多余的空格
  filteredText = filteredText.replace(/\s+/g, ' ').trim()
  
  return filteredText
}

// 检查是否包含屏蔽关键词
export function containsBlockedKeywords(text: string): boolean {
  return BLOCKED_KEYWORDS.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  )
}

// 获取屏蔽的关键词列表
export function getBlockedKeywords(): string[] {
  return [...BLOCKED_KEYWORDS]
}

// 添加新的屏蔽关键词
export function addBlockedKeyword(keyword: string): void {
  if (!BLOCKED_KEYWORDS.includes(keyword)) {
    BLOCKED_KEYWORDS.push(keyword)
  }
}