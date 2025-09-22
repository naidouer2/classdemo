'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AI_MODELS } from '@/lib/chat-api';

interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({ currentModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModelInfo = AI_MODELS.find(m => m.id === currentModel);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <span className="truncate max-w-32">
          {currentModelInfo?.name || '选择模型'}
        </span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <div className="py-1">
              {AI_MODELS.map(model => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-gray-500">{model.description}</div>
                  {model.pricing && (
                    <div className="text-xs text-gray-400 mt-1">
                      输入: ${model.pricing.input}/1K tokens • 
                      输出: ${model.pricing.output}/1K tokens
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}