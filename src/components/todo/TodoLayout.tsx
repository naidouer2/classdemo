'use client'

import { useState, useMemo } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { TodoList } from './TodoList'
import { TodoForm } from './TodoForm'
import { TodoFilters } from './TodoFilters'
import { TodoStats } from './TodoStats'
import { Todo, TodoFilters as Filters } from '@/types/todo'

export function TodoLayout() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, filterTodos, getStats } = useTodos()
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    priority: undefined,
    search: '',
    tags: []
  })

  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTodo(todoData)
  }

  const stats = useMemo(() => getStats(), [getStats])
  const filteredTodos = useMemo(() => filterTodos(filters), [filterTodos, filters])

  return (
    <div className="flex-1 flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* 左侧边栏 */}
      <div className="w-80 bg-white/70 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-xl rounded-r-2xl">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">待办清单</h2>
          <TodoForm onAddTodo={handleAddTodo} />
        </div>

        <div className="p-6 border-b border-white/20">
          <TodoFilters 
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={Array.from(new Set(todos.flatMap(t => t.tags)))}
          />
        </div>

        <div className="p-6 flex-1">
          <TodoStats stats={stats} />
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-white/20 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">任务列表</h1>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              {filteredTodos.length} 个任务
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <TodoList 
            todos={filteredTodos}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            onToggleTodo={toggleTodo}
          />
        </div>
      </div>
    </div>
  )
}