'use client'

import { useState } from 'react'
import { Trash2, Edit3, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Todo } from '@/types/todo'

interface TodoItemProps {
  todo: Todo
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void
  onDeleteTodo: (id: string) => void
  onToggleTodo: (id: string) => void
}

export function TodoItem({ todo, onUpdateTodo, onDeleteTodo, onToggleTodo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')

  const priorityColors = {
    low: 'border-l-emerald-400 bg-gradient-to-r from-emerald-50/80 to-green-50/80',
    medium: 'border-l-amber-400 bg-gradient-to-r from-amber-50/80 to-yellow-50/80',
    high: 'border-l-rose-400 bg-gradient-to-r from-rose-50/80 to-red-50/80'
  }

  const handleSave = () => {
    onUpdateTodo(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (isEditing) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl p-5 space-y-4 shadow-lg">
        <Input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="font-medium bg-white/60 border-white/40 focus:border-purple-300 focus:ring-purple-200"
        />
        <Input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="描述（可选）"
          className="text-sm bg-white/60 border-white/40 focus:border-purple-300 focus:ring-purple-200"
        />
        <div className="flex space-x-3">
          <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md">
            <Check className="w-4 h-4 mr-1" />
            保存
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-300 hover:bg-gray-50">
            <X className="w-4 h-4 mr-1" />
            取消
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className={`
      transition-all duration-300 border-l-4
      ${priorityColors[todo.priority]}
      ${todo.completed ? 'opacity-70 scale-[0.98]' : 'hover:scale-[1.02]'}
    `}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleTodo(todo.id)}
            className="mt-1 h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 focus:ring-2 transition-all duration-200"
          />
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </h3>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteTodo(todo.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {todo.description && (
              <p className={`text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}

            <div className="flex items-center space-x-3 text-sm">
              {todo.dueDate && (
                <span className="text-gray-500">
                  {formatDate(todo.dueDate)}
                </span>
              )}
              
              <Badge variant={
                todo.priority === 'high' ? 'destructive' : 
                todo.priority === 'medium' ? 'default' : 
                'secondary'
              }>
                {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
              </Badge>

              {todo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {todo.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}