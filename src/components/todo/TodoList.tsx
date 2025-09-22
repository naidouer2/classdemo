'use client'

import { Todo } from '@/types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void
  onDeleteTodo: (id: string) => void
  onToggleTodo: (id: string) => void
}

export function TodoList({ todos, onUpdateTodo, onDeleteTodo, onToggleTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-gray-700 font-semibold mb-2 text-lg">暂无任务</h3>
          <p className="text-gray-500 text-sm">开始添加你的第一个任务吧！</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
          onToggleTodo={onToggleTodo}
        />
      ))}
    </div>
  )
}