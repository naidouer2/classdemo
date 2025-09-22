'use client';

import { useState, useEffect } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { useChat } from '@/hooks/useChat';
import { usePromptTemplates } from '@/hooks/usePromptTemplates';
import { Settings } from '@/components/Settings';
import { APIKeyManager } from '@/lib/api';

export function ChatLayout() {
  const chat = useChat();
  const promptTemplates = usePromptTemplates();
  const [showSettings, setShowSettings] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // 检查API密钥状态
  useEffect(() => {
    const checkApiKey = () => {
      const key = APIKeyManager.getKey();
      setHasApiKey(!!key);
      if (!key) {
        setShowSettings(true);
      }
    };
    
    checkApiKey();
    // 监听存储变化
    const handleStorageChange = () => checkApiKey();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 当设置关闭时重新检查API密钥
  const handleSettingsClose = () => {
    setShowSettings(false);
    const key = APIKeyManager.getKey();
    setHasApiKey(!!key);
  };

  const handleSelectSession = (sessionId: string) => {
    chat.selectSession(sessionId);
  };

  const handleNewSession = (model?: string) => {
    chat.createNewSession(model);
  };

  const handleDeleteSession = (sessionId: string) => {
    chat.deleteSession(sessionId);
  };

  const handleClearSession = () => {
    chat.clearCurrentSession();
  };

  const handleSendMessage = async (content: string) => {
    if (!hasApiKey) {
      setShowSettings(true);
      return;
    }
    
    if (chat.settings.enableStream) {
      await chat.sendStreamMessage(content);
    } else {
      await chat.sendMessage(content);
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 h-screen flex gap-4 p-4">
        {/* 侧边栏 */}
        <div className="w-80 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <ChatSidebar
            sessions={chat.sessions}
            currentSessionId={chat.currentSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            onOpenSettings={() => setShowSettings(true)}
            promptTemplates={promptTemplates}
          />
        </div>

        {/* 主聊天区域 */}
        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <ChatWindow
            session={chat.currentSession}
            isLoading={chat.isLoading}
            isStreaming={chat.isStreaming}
            settings={chat.settings}
            onSendMessage={handleSendMessage}
            onUpdateSystemPrompt={chat.updateSystemPrompt}
            onUpdateSettings={chat.updateSettings}
            onClearSession={handleClearSession}
          />
        </div>
      </div>

      {/* 设置弹窗 */}
      <Settings
        isOpen={showSettings}
        onClose={handleSettingsClose}
      />
    </div>
  );
}