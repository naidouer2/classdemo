# AI 记事本应用

一个基于 Next.js 的 AI 原生笔记应用，集成 OpenRouter API 提供智能写作辅助功能。

## 功能特性

- 📝 **Markdown 编辑器**：支持实时预览、语法高亮
- 🤖 **AI 智能助手**：
  - 自动生成标题
  - 智能标签推荐
  - 内容润色优化
- 💾 **本地存储**：所有数据保存在浏览器本地
- 🔍 **全文搜索**：支持标题、内容、标签搜索
- 📱 **响应式设计**：适配桌面和移动设备

## 技术栈

- **框架**：Next.js 14 (静态导出模式)
- **UI**：Tailwind CSS + Shadcn UI
- **Markdown**：react-markdown
- **AI**：OpenRouter API (DeepSeek)
- **存储**：浏览器 localStorage
- **部署**：静态网站托管

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 获取 API 密钥

1. 访问 [OpenRouter](https://openrouter.ai/keys)
2. 注册账号并创建 API 密钥
3. 在应用中点击设置图标，输入您的 API 密钥

### 3. 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
npm run export
```

生成的静态文件将在 `out/` 目录中。

## 部署选项

### Vercel (推荐)

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
npm run export
# 上传 out/ 目录到 Netlify
```

### GitHub Pages

1. 构建项目：`npm run build && npm run export`
2. 将 `out/` 目录内容推送到 GitHub Pages

## 使用指南

### 创建笔记
1. 点击左侧"新建笔记"按钮
2. 开始输入内容，支持 Markdown 格式

### AI 功能
- **生成标题**：点击"生成标题"按钮，AI 会根据内容创建合适的标题
- **生成标签**：点击"生成标签"按钮，AI 会推荐相关标签
- **内容润色**：点击"润色内容"按钮，AI 会优化文本表达
- **对比查看**：点击"对比查看"按钮，查看原始内容与润色后的对比

### 数据管理
- 所有笔记自动保存在浏览器本地存储
- 无需登录，即开即用
- 支持导出/导入功能（开发中）

## 开发计划

- [ ] 笔记导入/导出功能
- [ ] 主题切换（深色/浅色）
- [ ] 笔记分享功能
- [ ] 全文搜索优化
- [ ] 移动端适配优化

## 许可证

MIT License