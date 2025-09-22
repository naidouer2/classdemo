"use client"

import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

interface PolishModalProps {
  isOpen: boolean
  onClose: () => void
  originalContent: string
  polishedContent: string
  onApplyPolished: (content: string) => void
}

export function PolishModal({ 
  isOpen, 
  onClose, 
  originalContent, 
  polishedContent, 
  onApplyPolished 
}: PolishModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  const handleApply = () => {
    onApplyPolished(polishedContent)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>AI 内容润色对比</DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="grid grid-cols-2 gap-6 max-h-[70vh] overflow-hidden">
          {/* Original */}
          <Card>
            <CardContent className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">原始内容</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(originalContent)}
                  className="flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold mb-1">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-gray-300 pl-3 italic mb-2">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                    pre: ({ children }) => <pre className="bg-gray-100 p-2 rounded mb-2 overflow-x-auto">{children}</pre>,
                  }}
                >
                  {originalContent || '*无内容*'}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Polished */}
          <Card>
            <CardContent className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-green-600">润色后内容</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(polishedContent)}
                  className="flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold mb-1">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-green-300 pl-3 italic mb-2">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => <code className="bg-green-50 px-1 py-0.5 rounded text-xs">{children}</code>,
                    pre: ({ children }) => <pre className="bg-green-50 p-2 rounded mb-2 overflow-x-auto">{children}</pre>,
                  }}
                >
                  {polishedContent || '*无内容*'}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            您可以选择接受润色后的内容，或保留原始内容
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleApply} className="bg-green-600 hover:bg-green-700">
              应用润色内容
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}