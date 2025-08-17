# 前度智能搜索

一个基于 Next.js 14 和 AI 技术的智能搜索引擎，通过 Google API 和 GLM 大模型为用户提供经过筛选和提炼的高质量搜索结果。

## 功能特点

- 🤖 **AI 驱动**：使用 GLM 大模型理解和分析搜索意图
- 🎯 **精准结果**：智能筛选最相关的内容，去除噪声
- 📱 **响应式设计**：完美适配各种设备
- ⚡ **快速加载**：骨架屏和渐进式加载优化体验
- 🎨 **现代界面**：简洁优雅的设计语言

## 技术栈

- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **后端**：Next.js API Routes
- **AI 服务**：智谱 AI GLM 模型
- **搜索源**：Google Programmable Search Engine API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的 API 密钥：

```bash
cp .env.example .env.local
```

在 `.env.local` 中配置：

```env
# Google API 配置
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# GLM API 配置
GLM_API_KEY=your_glm_api_key
```

### 3. 获取 API 密钥

#### Google API
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 "Custom Search API"
4. 创建 API 密钥

#### 搜索引擎 ID
1. 访问 [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. 创建新的搜索引擎
3. 获取搜索引擎 ID

#### GLM API
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并获取 API 密钥

### 4. 运行开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
smart-search/
├── src/
│   ├── app/
│   │   ├── api/search/     # 搜索 API
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 布局组件
│   │   └── page.tsx        # 主页面
│   └── components/
│       ├── LoadingSpinner.tsx  # 加载动画
│       └── SearchResults.tsx   # 搜索结果组件
├── public/                 # 静态资源
├── .env.example           # 环境变量模板
└── README.md             # 项目说明
```

## 工作原理

1. 用户输入搜索关键词
2. 前端发送请求到后端 API
3. 后端调用 Google Search API 获取原始结果
4. 将结果发送给 GLM 模型进行智能处理
5. GLM 分析意图、筛选结果、生成摘要
6. 返回经过优化的结构化数据
7. 前端渲染成美观的卡片界面

## 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 其他平台

项目支持部署到任何支持 Next.js 的平台，如 Netlify、Railway 等。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
