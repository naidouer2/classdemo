'use client';

import { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({
  value,
  onChange,
  onKeyPress,
  placeholder = "输入消息...",
  disabled = false
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[48px] max-h-[120px] w-full resize-none border-0 bg-transparent focus:ring-0 focus:outline-none px-4 py-3 pr-20 placeholder:text-gray-400"
          rows={1}
        />
        
        {!disabled && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-50/80 px-2 py-1 rounded-lg">
            ⏎ 发送 • ⇧⏎ 换行
          </div>
        )}
      </div>
    </div>
  );
}