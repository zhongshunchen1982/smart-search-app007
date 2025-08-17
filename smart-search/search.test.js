const { describe, it, expect } = require('@jest/globals')

// 导入要测试的函数
const { filterKeywords, containsBlockedKeywords, getBlockedKeywords } = require('../src/lib/keywordFilter')

describe('关键词过滤功能', () => {
  it('应该过滤掉敏感词', () => {
    const result = filterKeywords('周也 台湾男朋友')
    expect(result).toBe('周也 男朋友')
  })

  it('应该过滤掉多个敏感词', () => {
    const result = filterKeywords('大陆 台湾 相关内容')
    expect(result).toBe('相关内容')
  })

  it('应该保留非敏感内容', () => {
    const result = filterKeywords('周也 个人信息')
    expect(result).toBe('周也 个人信息')
  })

  it('应该正确识别包含敏感词', () => {
    expect(containsBlockedKeywords('台湾')).toBe(true)
    expect(containsBlockedKeywords('大陆')).toBe(true)
    expect(containsBlockedKeywords('周也')).toBe(false)
  })

  it('应该获取屏蔽词列表', () => {
    const blockedWords = getBlockedKeywords()
    expect(blockedWords).toContain('台湾')
    expect(blockedWords).toContain('大陆')
  })
})

describe('搜索流程测试', () => {
  it('应该正确处理搜索请求', async () => {
    // 这里可以添加API测试
    const testQuery = '周也 个人信息'
    const response = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: testQuery }),
    })
    
    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data).toHaveProperty('coreResults')
    expect(data).toHaveProperty('searchMetadata')
  })

  it('应该阻止敏感词搜索', async () => {
    const testQuery = '台湾'
    const response = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: testQuery }),
    })
    
    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.directAnswer).toContain('敏感词汇')
  })
})

console.log('测试脚本已创建')
console.log('运行命令: cd smart-search && npm test')