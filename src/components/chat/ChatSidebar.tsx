'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Settings, Trash2, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatSession, PromptTemplate } from '@/types/chat';
import { usePromptTemplates } from '@/hooks/usePromptTemplates';
import { AI_MODELS } from '@/lib/chat-api';
import { APIKeyManager } from '@/lib/api';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: (model?: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onOpenSettings: () => void;
  promptTemplates: ReturnType<typeof usePromptTemplates>;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onOpenSettings,
  promptTemplates
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPromptTemplates, setShowPromptTemplates] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // 检查API密钥状态
  useEffect(() => {
    const checkApiKey = () => {
      const key = APIKeyManager.getKey();
      setHasApiKey(!!key);
    };
    
    checkApiKey();
    // 监听存储变化
    const handleStorageChange = () => checkApiKey();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNewSession = (model?: string) => {
    if (!hasApiKey) {
      onOpenSettings();
      return;
    }
    onNewSession(model);
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 border-r border-gray-200/50 flex flex-col h-full backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI对话</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="p-2 h-9 w-9 hover:bg-white/60 rounded-xl transition-all duration-200 shadow-sm border border-gray-200/50"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="space-y-3">
          <Button
            onClick={() => handleNewSession()}
            className="w-full flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            新建对话
            {!hasApiKey && <AlertCircle className="h-4 w-4 text-amber-300 animate-pulse" />}
          </Button>

          {/* Model Selector for New Chat */}
          <div className="text-xs text-gray-600">
            <select
              onChange={(e) => handleNewSession(e.target.value)}
              className="w-full p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              defaultValue=""
            >
              <option value="" disabled>选择模型新建对话</option>
              {AI_MODELS.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prompt Templates Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPromptTemplates(!showPromptTemplates)}
          className="w-full mt-3 text-sm bg-white/60 hover:bg-white/80 border-gray-200/50 rounded-xl py-2 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {showPromptTemplates ? '隐藏' : '显示'}提示词模板
        </Button>
      </div>

      {/* Search */}
      <div className="p-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="搜索对话..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showPromptTemplates ? (
          /* Prompt Templates Panel */
          <div className="p-6">
            <div className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
              提示词模板
            </div>
            <div className="space-y-3">
              {promptTemplates.templates.map(template => (
                <div
                  key={template.id}
                  className="p-4 text-sm bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 hover:shadow-md cursor-pointer transition-all duration-200 group"
                  onClick={() => {
                    handleNewSession();
                    setShowPromptTemplates(false);
                  }}
                >
                  <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{template.name}</div>
                  <div className="text-xs text-gray-600 truncate mt-1 leading-relaxed">{template.content}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Sessions List */
          <div className="space-y-3 px-6">
            {filteredSessions.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  {searchQuery ? '没有找到匹配的对话' : '还没有对话，开始新建一个吧！'}
                </p>
              </div>
            ) : (
              filteredSessions.map(session => (
                <div
                  key={session.id}
                  className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                    currentSessionId === session.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300/50 shadow-md'
                      : 'bg-white/60 backdrop-blur-sm hover:bg-white/80 border-gray-200/50 hover:shadow-md'
                  }`}
                >
                  <div 
                    className="flex items-start justify-between"
                    onClick={() => onSelectSession(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${
                        currentSessionId === session.id 
                          ? 'text-blue-700' 
                          : 'text-gray-800 group-hover:text-blue-600'
                      } transition-colors`}>
                        {session.title}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(session.updatedAt)}
                        </div>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {session.messages.length} 条消息
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 h-8 w-8 hover:bg-red-50 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('确定要删除这个对话吗？')) {
                          onDeleteSession(session.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-600 transition-colors" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}