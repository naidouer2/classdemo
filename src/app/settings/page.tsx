'use client';

import { useState } from 'react';
import { Settings, Key, Bot, Database } from 'lucide-react';
import { APIKeyManager } from '@/lib/api';
import { AI_MODELS } from '@/lib/chat-api';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState(APIKeyManager.getKey() || '');
  const [tempKey, setTempKey] = useState('');

  const handleSaveApiKey = () => {
    if (tempKey.trim()) {
      APIKeyManager.setKey(tempKey.trim());
      setApiKey(tempKey.trim());
      setTempKey('');
      alert('API密钥已保存');
    }
  };

  const handleRemoveApiKey = () => {
    if (confirm('确定要删除API密钥吗？')) {
      APIKeyManager.removeKey();
      setApiKey('');
      setTempKey('');
      alert('API密钥已删除');
    }
  };

  const clearAllData = () => {
    if (confirm('确定要清除所有本地数据吗？这将删除所有笔记、待办事项和对话记录！')) {
      localStorage.clear();
      alert('所有数据已清除');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-6 h-6" />
            <h1 className="text-2xl font-bold">设置</h1>
          </div>

          {/* API密钥设置 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">API密钥</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  OpenRouter API密钥
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="输入您的API密钥..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    保存
                  </button>
                </div>
                {apiKey && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-green-600">✓ 已配置</span>
                    <button
                      onClick={handleRemoveApiKey}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      删除密钥
                    </button>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                <p>获取API密钥：</p>
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://openrouter.ai/keys
                </a>
              </div>
            </div>
          </div>

          {/* 可用模型 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">可用模型</h2>
            </div>
            
            <div className="space-y-3">
              {AI_MODELS.map(model => (
                <div key={model.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{model.name}</h3>
                      <p className="text-sm text-gray-600">{model.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        最大长度: {model.maxTokens} tokens
                      </p>
                    </div>
                    {model.pricing && (
                      <div className="text-right text-sm">
                        <div className="text-gray-600">
                          ¥{model.pricing.input * 1000}/1K输入
                        </div>
                        <div className="text-gray-600">
                          ¥{model.pricing.output * 1000}/1K输出
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 数据管理 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold">数据管理</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">本地存储</h3>
                <p className="text-sm text-gray-600 mb-3">
                  所有数据都存储在您的浏览器本地，不会上传到服务器。
                </p>
                <button
                  onClick={clearAllData}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  清除所有本地数据
                </button>
              </div>
            </div>
          </div>

          {/* 关于 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">关于</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>AI工具箱 - 您的智能助手</p>
              <p>版本: 1.0.0</p>
              <p>技术支持: Next.js + TypeScript + Tailwind CSS</p>
              <p>AI服务: OpenRouter API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}