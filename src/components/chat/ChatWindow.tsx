'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Settings, RotateCcw, Bot, User } from 'lucide-react';
import { ChatSession, ChatSettings } from '@/types/chat';
import { MessageInput } from './MessageInput';
import { MessageBubble } from './MessageBubble';
import { ModelSelector } from './ModelSelector';
import { ChatSettingsPanel } from './ChatSettingsPanel';

interface ChatWindowProps {
  session: ChatSession | null;
  isLoading: boolean;
  isStreaming: boolean;
  settings: ChatSettings;
  onSendMessage: (content: string) => Promise<void>;
  onUpdateSystemPrompt: (systemPrompt: string) => void;
  onUpdateSettings: (settings: Partial<ChatSettings>) => void;
  onClearSession: () => void;
}

export function ChatWindow({
  session,
  isLoading,
  isStreaming,
  settings,
  onSendMessage,
  onUpdateSystemPrompt,
  onUpdateSettings,
  onClearSession
}: ChatWindowProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session) return;
    
    try {
      await onSendMessage(inputValue.trim());
      setInputValue('');
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">开始AI对话</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">点击左侧的&quot;新建对话&quot;按钮开始与AI助手聊天</p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              使用步骤
            </h3>
            <ol className="text-sm text-blue-800 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                确保已配置API密钥（点击设置按钮）
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                点击左侧&quot;新建对话&quot;按钮
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">3</span>
                选择AI模型（可选）
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">4</span>
                开始与AI助手对话
              </li>
            </ol>
          </div>
          
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200/50">
              <span className="text-lg">📝</span>
              <span className="text-gray-700 font-medium">记事本 - 记录和管理笔记</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-gray-200/50">
              <span className="text-lg">✅</span>
              <span className="text-gray-700 font-medium">待办清单 - 管理任务和计划</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
              <span className="text-lg">🤖</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">AI对话 - 与AI助手交流</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-sm animate-pulse"></div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{session.title}</h1>
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-sm text-gray-600 rounded-full border border-gray-200/50">
              {session.messages.length} 条消息
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <ModelSelector
              currentModel={session.model}
              onModelChange={(model) => {
                // 创建新会话使用选择的模型
                console.log('Model changed to:', model);
              }}
            />
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 hover:bg-white/60 rounded-xl transition-all duration-200 group shadow-sm border border-gray-200/50"
              title="设置"
            >
              <Settings className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
            </button>
            
            <button
              onClick={onClearSession}
              className="p-2.5 hover:bg-red-50 rounded-xl transition-all duration-200 group shadow-sm border border-gray-200/50"
              title="清空对话"
            >
              <RotateCcw className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <ChatSettingsPanel
          settings={settings}
          systemPrompt={session.systemPrompt || settings.systemPrompt}
          onUpdateSystemPrompt={onUpdateSystemPrompt}
          onUpdateSettings={onUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {session.messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 text-lg font-medium">开始与AI助手对话吧！</p>
            <p className="text-gray-400 text-sm mt-2">输入您的问题，我会尽力为您解答</p>
          </div>
        ) : (
          <div className="space-y-6">
            {session.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLoading={message.role === 'assistant' && isStreaming}
              />
            ))}
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && !isStreaming && (
          <div className="flex items-center justify-start mb-4">
            <div className="max-w-[70%] bg-white/80 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm border border-gray-200/50 mr-12">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">AI正在思考</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm p-6">
        <div className="flex items-end space-x-4 max-w-4xl mx-auto">
          <div className="flex-1">
            <MessageInput
              value={inputValue}
              onChange={setInputValue}
              onKeyPress={handleKeyPress}
              placeholder="输入消息..."
              disabled={isLoading || isStreaming}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || isStreaming}
            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm group"
          >
            <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}