'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ChatSettings } from '@/types/chat';
import { AI_MODELS } from '@/lib/chat-api';

interface ChatSettingsPanelProps {
  settings: ChatSettings;
  systemPrompt: string;
  onUpdateSystemPrompt: (systemPrompt: string) => void;
  onUpdateSettings: (settings: Partial<ChatSettings>) => void;
  onClose: () => void;
}

export function ChatSettingsPanel({
  settings,
  systemPrompt,
  onUpdateSystemPrompt,
  onUpdateSettings,
  onClose
}: ChatSettingsPanelProps) {
  const [localSystemPrompt, setLocalSystemPrompt] = useState(systemPrompt);

  const handleSystemPromptChange = () => {
    onUpdateSystemPrompt(localSystemPrompt);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border-b border-gray-200/50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg flex items-center gap-3">
          <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">对话设置</span>
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/60 rounded-xl transition-all duration-200 group shadow-sm border border-gray-200/50"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
        </button>
      </div>

      <div className="space-y-6">
        {/* 模型选择 */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            默认模型
          </label>
          <select
            value={settings.defaultModel}
            onChange={(e) => onUpdateSettings({ defaultModel: e.target.value })}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {AI_MODELS.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* 系统提示词 */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            系统提示词
          </label>
          <textarea
            value={localSystemPrompt}
            onChange={(e) => setLocalSystemPrompt(e.target.value)}
            onBlur={handleSystemPromptChange}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl text-sm min-h-[100px] shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
            placeholder="设置AI助手的角色和行为..."
          />
        </div>

        {/* 最大令牌数 */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              最大回复长度
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {settings.maxTokens} tokens
            </span>
          </label>
          <div className="relative">
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={settings.maxTokens}
              onChange={(e) => onUpdateSettings({ maxTokens: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>100</span>
              <span>2000</span>
              <span>4000</span>
            </div>
          </div>
        </div>

        {/* 温度参数 */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              创造力
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {settings.temperature}
            </span>
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0 (确定)</span>
              <span>0.5</span>
              <span>1 (创造)</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg p-2">
            💡 较低值让AI回答更准确，较高值让AI回答更有创造性
          </div>
        </div>

        {/* 流式响应 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              <div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">启用流式响应</span>
                <div className="text-xs text-gray-500 mt-1">实时显示AI回复内容，提升交互体验</div>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.enableStream}
                onChange={(e) => onUpdateSettings({ enableStream: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-all duration-200 ${
                settings.enableStream 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md' 
                  : 'bg-gray-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 mt-0.5 ${
                  settings.enableStream ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}