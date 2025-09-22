import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { ChatSession, ChatMessage, ChatSettings } from '@/types/chat';
import { ChatAPI, AI_MODELS } from '@/lib/chat-api';
import { APIKeyManager } from '@/lib/api';

interface UseChatReturn {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentSession: ChatSession | null;
  isLoading: boolean;
  isStreaming: boolean;
  apiKey: string | null;
  chatAPI: ChatAPI | null;
  settings: ChatSettings;
  
  // Actions
  createNewSession: (model?: string) => string;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  sendStreamMessage: (content: string) => Promise<void>;
  updateSystemPrompt: (systemPrompt: string) => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  clearCurrentSession: () => void;
}

export function useChat(): UseChatReturn {
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>({ 
    key: 'chat_sessions', 
    defaultValue: [] 
  });
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [chatAPI, setChatAPI] = useState<ChatAPI | null>(null);
  
  const [settings, setSettings] = useLocalStorage<ChatSettings>({
    key: 'chat_settings',
    defaultValue: {
      defaultModel: 'deepseek/deepseek-chat-v3.1',
      systemPrompt: '你是一个智能助手，请尽可能有帮助地回答用户的问题。',
      maxTokens: 2000,
      temperature: 0.7,
      enableStream: true
    }
  });

  // 初始化API密钥
  useEffect(() => {
    const key = APIKeyManager.getKey();
    setApiKey(key);
    if (key) {
      setChatAPI(new ChatAPI(key));
    }
  }, []);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  const createNewSession = useCallback((model?: string): string => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: '新对话',
      messages: [],
      model: model || settings.defaultModel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      systemPrompt: settings.systemPrompt
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, [settings, setSessions]);

  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId, setSessions]);

  const updateSession = useCallback((sessionId: string, updates: Partial<ChatSession>) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, ...updates, updatedAt: new Date().toISOString() }
        : session
    ));
  }, [setSessions]);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatAPI || !currentSession) return;

    setIsLoading(true);

    try {
      // 添加用户消息
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...currentSession.messages, userMessage];
      updateSession(currentSession.id, { messages: updatedMessages });

      // 获取AI回复
      const response = await chatAPI.sendMessage(
        updatedMessages,
        currentSession.model,
        currentSession.systemPrompt,
        settings.maxTokens,
        settings.temperature
      );

      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        model: currentSession.model
      };

      const finalMessages = [...updatedMessages, aiMessage];
      updateSession(currentSession.id, { messages: finalMessages });

      // 如果是新对话，生成标题
      if (currentSession.title === '新对话' && finalMessages.length === 2) {
        const title = await chatAPI.generateTitle(finalMessages);
        updateSession(currentSession.id, { title });
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [chatAPI, currentSession, settings, updateSession]);

  const sendStreamMessage = useCallback(async (content: string) => {
    if (!chatAPI || !currentSession || !settings.enableStream) return;

    setIsStreaming(true);

    try {
      // 添加用户消息
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...currentSession.messages, userMessage];
      updateSession(currentSession.id, { messages: updatedMessages });

      // 创建AI消息占位符
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        model: currentSession.model,
        isStreaming: true
      };

      const streamingMessages = [...updatedMessages, aiMessage];
      updateSession(currentSession.id, { messages: streamingMessages });

      // 流式获取回复
      let finalContent = '';
      for await (const chunk of chatAPI.streamMessage(
        updatedMessages,
        currentSession.model,
        currentSession.systemPrompt,
        settings.maxTokens,
        settings.temperature
      )) {
        finalContent = chunk.content;
        
        const messagesWithStream = currentSession.messages.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, content: finalContent, isStreaming: !chunk.isComplete }
            : msg
        );
        
        updateSession(currentSession.id, { messages: messagesWithStream });
      }

      // 更新最终消息
      const finalMessages = currentSession.messages.map(msg => 
        msg.id === aiMessage.id 
          ? { ...msg, content: finalContent, isStreaming: false }
          : msg
      );
      
      updateSession(currentSession.id, { messages: finalMessages });

      // 如果是新对话，生成标题
      if (currentSession.title === '新对话' && finalMessages.length === 2) {
        const title = await chatAPI.generateTitle(finalMessages);
        updateSession(currentSession.id, { title });
      }
    } catch (error) {
      console.error('流式发送消息失败:', error);
      throw error;
    } finally {
      setIsStreaming(false);
    }
  }, [chatAPI, currentSession, settings, updateSession]);

  const updateSystemPrompt = useCallback((systemPrompt: string) => {
    if (currentSession) {
      updateSession(currentSession.id, { systemPrompt });
    }
  }, [currentSession, updateSession]);

  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, [setSettings]);

  const clearCurrentSession = useCallback(() => {
    if (currentSession) {
      updateSession(currentSession.id, { messages: [] });
    }
  }, [currentSession, updateSession]);

  return {
    sessions,
    currentSessionId,
    currentSession,
    isLoading,
    isStreaming,
    apiKey,
    chatAPI,
    settings,
    createNewSession,
    selectSession,
    deleteSession,
    sendMessage,
    sendStreamMessage,
    updateSystemPrompt,
    updateSettings,
    clearCurrentSession
  };
}