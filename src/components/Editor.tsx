"use client"

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Sparkles, Eye, Edit3, AlertCircle } from 'lucide-react'
import { Note } from '@/types/note'
import { APIKeyManager } from '@/lib/api'

interface EditorProps {
  note: Note | null
  onUpdateNote: (note: Note) => void
  onGenerateTitle: (content: string) => Promise<string>
  onGenerateTags: (content: string) => Promise<string[]>
  onPolishContent: (content: string) => Promise<string>
}

export function Editor({ 
  note, 
  onUpdateNote, 
  onGenerateTitle, 
  onGenerateTags, 
  onPolishContent
}: EditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)
  const [isPolishing, setIsPolishing] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

  // 检查API密钥状态
  useEffect(() => {
    const checkApiKey = () => {
      if (typeof window !== 'undefined') {
        const hasKey = APIKeyManager.hasKey()
        console.log('API密钥检查结果:', hasKey)
        setHasApiKey(hasKey)
      }
    }
    
    checkApiKey()
    
    // 监听存储变化
    const handleStorageChange = () => {
      console.log('Storage事件触发，重新检查API密钥')
      checkApiKey()
    }
    
    // 监听自定义事件（用于强制刷新）
    const handleForceRefresh = () => {
      console.log('收到apiKeyUpdated事件，重新检查API密钥')
      checkApiKey()
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('apiKeyUpdated', handleForceRefresh)
      
      // 定期检查API密钥状态（每3秒）
      const interval = setInterval(checkApiKey, 3000)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('apiKeyUpdated', handleForceRefresh)
        clearInterval(interval)
      }
    }
  }, [])

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <div className="text-4xl">📝</div>
          </div>
          <h3 className="text-gray-700 font-bold text-xl mb-3">选择一个笔记</h3>
          <p className="text-gray-500 text-base">或从左侧创建一个新笔记开始</p>
        </div>
      </div>
    )
  }

  const handleTitleChange = (newTitle: string) => {
    onUpdateNote({
      ...note,
      title: newTitle,
      updatedAt: new Date().toISOString()
    })
  }

  const handleContentChange = (newContent: string) => {
    onUpdateNote({
      ...note,
      content: newContent,
      updatedAt: new Date().toISOString()
    })
  }

  const handleTagsChange = (newTags: string) => {
    const tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    onUpdateNote({
      ...note,
      tags,
      updatedAt: new Date().toISOString()
    })
  }

  const handleGenerateTitle = async () => {
    if (!note.content.trim()) {
      alert('请先输入笔记内容')
      return
    }
    
    setIsGeneratingTitle(true)
    try {
      const newTitle = await onGenerateTitle(note.content)
      handleTitleChange(newTitle)
    } catch (error) {
      console.error('生成标题失败:', error)
      alert(`生成标题失败: ${error instanceof Error ? error.message : '未知错误'}\n\n请检查：\n1. 是否已配置API密钥（点击设置按钮）\n2. 网络连接是否正常\n3. API密钥是否有效`)
    } finally {
      setIsGeneratingTitle(false)
    }
  }

  const handleGenerateTags = async () => {
    if (!note.content.trim()) {
      alert('请先输入笔记内容')
      return
    }
    
    setIsGeneratingTags(true)
    try {
      const newTags = await onGenerateTags(note.content)
      handleTagsChange(newTags.join(', '))
    } catch (error) {
      console.error('生成标签失败:', error)
      alert(`生成标签失败: ${error instanceof Error ? error.message : '未知错误'}\n\n请检查：\n1. 是否已配置API密钥（点击设置按钮）\n2. 网络连接是否正常\n3. API密钥是否有效`)
    } finally {
      setIsGeneratingTags(false)
    }
  }

  const handlePolishContent = async () => {
    if (!note.content.trim()) {
      alert('请先输入笔记内容')
      return
    }
    
    setIsPolishing(true)
    try {
      const polishedContent = await onPolishContent(note.content)
      onUpdateNote({
        ...note,
        content: polishedContent,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('润色内容失败:', error)
      alert(`润色内容失败: ${error instanceof Error ? error.message : '未知错误'}\n\n请检查：\n1. 是否已配置API密钥（点击设置按钮）\n2. 网络连接是否正常\n3. API密钥是否有效`)
    } finally {
      setIsPolishing(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/30 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <Input
              value={note.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="✨ 笔记标题..."
              className="text-2xl font-bold border-none shadow-none focus:ring-0 p-0 bg-transparent placeholder-gray-400 text-gray-800"
            />
            <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              创建于 {new Date(note.createdAt).toLocaleDateString('zh-CN')}
              {note.createdAt !== note.updatedAt && 
                ` · 更新于 ${new Date(note.updatedAt).toLocaleDateString('zh-CN')}`
              }
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isPreview 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' 
                  : 'bg-white/50 hover:bg-white/80 text-gray-700'
              }`}
            >
              {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? '编辑' : '预览'}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Input
            value={note.tags.join(', ')}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="🏷️ 标签，用逗号分隔..."
            className="flex-1 text-sm bg-white/50 border-white/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateTags}
            disabled={isGeneratingTags || !note.content.trim()}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/50 border-white/30 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            {isGeneratingTags ? '生成中...' : '生成标签'}
          </Button>
        </div>

        {!hasApiKey && (
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-700">请先配置API密钥以使用AI功能</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const hasKey = APIKeyManager.hasKey()
                  console.log('手动刷新API密钥状态:', hasKey)
                  setHasApiKey(hasKey)
                  window.dispatchEvent(new CustomEvent('apiKeyUpdated'))
                }
              }}
              className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 px-2 py-1 h-auto text-xs"
            >
              刷新
            </Button>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateTitle}
            disabled={isGeneratingTitle || !note.content.trim() || !hasApiKey}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/50 border-white/30 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-200 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isGeneratingTitle ? '生成中...' : '生成标题'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateTags}
            disabled={isGeneratingTags || !note.content.trim() || !hasApiKey}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/50 border-white/30 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all duration-200 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isGeneratingTags ? '生成中...' : '生成标签'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePolishContent}
            disabled={isPolishing || !note.content.trim() || !hasApiKey}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/50 border-white/30 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-200 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isPolishing ? '润色中...' : '润色内容'}
          </Button>

        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isPreview ? (
          <div className="prose prose-lg max-w-none bg-white/30 rounded-2xl p-8 backdrop-blur-sm">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 text-gray-800">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-semibold mb-3 text-gray-700">{children}</h3>,
                p: ({ children }) => <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-8 mb-6 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-8 mb-6 space-y-2">{children}</ol>,
                blockquote: ({ children }) => 
                  <blockquote className="border-l-4 border-gradient-to-b from-purple-400 to-pink-400 bg-gradient-to-r from-purple-50 to-pink-50 pl-6 py-4 italic mb-6 rounded-r-xl">
                    {children}
                  </blockquote>,
                code: ({ children }) => <code className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-1 rounded-lg text-sm font-medium">{children}</code>,
                pre: ({ children }) => <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 rounded-xl mb-6 overflow-x-auto shadow-lg">{children}</pre>,
              }}
            >
              {note.content || '*暂无内容*'}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="bg-white/30 rounded-2xl p-6 backdrop-blur-sm h-full">
            <Textarea
              value={note.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="✨ 开始写作...\n\n💡 支持 Markdown 格式：\n• 使用 # 创建标题\n• 使用 * 或 - 创建列表\n• 使用 ` 创建代码块\n• 使用 ** 加粗文字\n\n让创意自由流淌..."
              className="w-full h-full min-h-[500px] resize-none border-none shadow-none focus:ring-0 text-lg leading-relaxed bg-transparent placeholder-gray-500 text-gray-800"
            />
          </div>
        )}
      </div>
    </div>
  )
}