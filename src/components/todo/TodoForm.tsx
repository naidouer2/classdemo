'use client'

import { useState } from 'react'
import { Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Todo } from '@/types/todo'

interface TodoFormProps {
  onAddTodo: (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    const todoData = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      dueDate: dueDate || undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    onAddTodo(todoData)
    
    // 重置表单
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setTags('')
    setIsExpanded(false)
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
        添加新任务
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="任务标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/60 border-white/40 focus:border-purple-300 focus:ring-purple-200 rounded-lg"
        />

        {isExpanded && (
          <>
            <Textarea
              placeholder="任务描述（可选）..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[60px] bg-white/60 border-white/40 focus:border-purple-300 focus:ring-purple-200 rounded-lg"
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-3 py-2 bg-white/60 border border-white/40 rounded-lg text-sm focus:border-purple-300 focus:ring-purple-200 focus:outline-none"
              >
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>

              <div className="relative">
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 bg-white/60 border-white/40 focus:border-purple-300 focus:ring-purple-200 rounded-lg"
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <Input
              type="text"
              placeholder="标签（用逗号分隔）..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-white/60 border-white/40 focus:border-purple-300 focus:ring-purple-200 rounded-lg"
            />
          </>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
          >
            {isExpanded ? '收起' : '展开'}选项
          </Button>

          <Button 
            type="submit" 
            size="sm"
            disabled={!title.trim()}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>添加任务</span>
          </Button>
        </div>
      </form>
    </div>
  )
}