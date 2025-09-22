'use client';

import { useState } from 'react';
import { Bot, User, Copy, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleRegenerate = () => {
    // 重新生成消息的实现
    console.log('重新生成:', message.id);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={cn(
        'max-w-[70%] rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl',
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-12' 
          : 'bg-white/80 text-gray-800 border border-gray-200/50 mr-12'
      )}>
        {/* Avatar and Header */}
        <div className="flex items-start space-x-3">
          {isAssistant && (
            <div className="flex-shrink-0 -ml-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                {isLoading ? (
                  <Bot className="w-4 h-4 text-white animate-pulse" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          )}
          
          {isUser && (
            <div className="flex-shrink-0 order-last -mr-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
            
            {/* Time and Model */}
            <div className={cn(
              'text-xs mt-3 flex items-center space-x-2 opacity-70',
              isUser ? 'text-blue-100' : 'text-gray-500'
            )}>
              <span>{formatTime(message.timestamp)}</span>
              {message.model && (
                <span className="hidden sm:inline px-2 py-1 bg-black/10 rounded-full">
                  {message.model.split('/').pop()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {isAssistant && message.content && (
          <div className="flex items-center space-x-1 mt-3 pt-2 border-t border-gray-200/30">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 group"
              title="复制"
            >
              <Copy className={cn(
                'w-3.5 h-3.5 transition-colors',
                copied ? 'text-green-500' : 'text-gray-500 group-hover:text-gray-700'
              )} />
            </button>

            <button
              onClick={handleRegenerate}
              className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 group"
              title="重新生成"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>

            <button
              className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 group"
              title="赞"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-500 transition-colors" />
            </button>

            <button
              className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 group"
              title="踩"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}