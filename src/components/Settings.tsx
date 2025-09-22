"use client"

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { APIKeyManager } from '@/lib/api'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  onSaveSettings?: (apiKey: string) => void
}

export function Settings({ isOpen, onClose, onSaveSettings }: SettingsProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    if (isOpen) {
      const savedKey = APIKeyManager.getKey()
      if (savedKey) {
        setApiKey(savedKey)
      }
    }
  }, [isOpen])

  const handleSave = () => {
    if (apiKey.trim()) {
      APIKeyManager.setKey(apiKey.trim())
      onSaveSettings?.(apiKey.trim())
      setTestResult({ success: true, message: 'API密钥已保存！' })
      
      // 触发自定义事件通知其他组件
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('apiKeyUpdated'))
        console.log('API密钥已保存并触发更新事件')
      }
    } else {
      APIKeyManager.removeKey()
      onSaveSettings?.('')
      setTestResult({ success: true, message: 'API密钥已清除！' })
      
      // 触发自定义事件通知其他组件
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('apiKeyUpdated'))
        console.log('API密钥已清除并触发更新事件')
      }
    }
  }

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: '请输入API密钥！' })
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://localhost:3001',
          'X-Title': 'U2记事本'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3.1',
          messages: [{ role: 'user', content: '你好' }],
          max_tokens: 10
        })
      })

      if (response.ok) {
        setTestResult({ success: true, message: '连接成功！API密钥有效。' })
      } else {
        setTestResult({ success: false, message: `连接失败：${response.status} ${response.statusText}` })
      }
    } catch (error) {
      setTestResult({ success: false, message: `连接失败：${error instanceof Error ? error.message : '网络错误'}` })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenRouter API 密钥
            </label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              您的API密钥将保存在浏览器本地存储中，不会上传到服务器。
            </p>
          </div>

          {/* API Key 获取指南 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">如何获取API密钥？</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>访问 <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">OpenRouter平台</a></li>
                <li>注册并登录账户</li>
                <li>创建新的API密钥</li>
                <li>复制密钥并粘贴到上方输入框</li>
              </ol>
            </CardContent>
          </Card>

          {/* Test Result */}
          {testResult && (
            <Card className={testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  {testResult.success ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                  <span className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResult.message}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-2"
          >
            {isTesting ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              '测试连接'
            )}
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              保存设置
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}