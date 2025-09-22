import { useState, useEffect, useCallback } from 'react'
import { Todo, TodoFilters } from '@/types/todo'

interface UseTodosOptions {
  defaultValue?: Todo[]
}

export function useTodos({ defaultValue = [] }: UseTodosOptions = {}) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 从localStorage加载数据
  useEffect(() => {
    const loadTodos = () => {
      try {
        const saved = localStorage.getItem('todos')
        if (saved) {
          setTodos(JSON.parse(saved))
        } else {
          setTodos(defaultValue)
        }
      } catch (error) {
        console.error('加载todos失败:', error)
        setTodos(defaultValue)
      } finally {
        setIsLoading(false)
      }
    }

    loadTodos()
  }, [defaultValue])

  // 保存到localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('todos', JSON.stringify(todos))
      } catch (error) {
        console.error('保存todos失败:', error)
      }
    }
  }, [todos, isLoading])

  // 添加任务
  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTodos(prev => [newTodo, ...prev])
    return newTodo
  }

  // 更新任务
  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ))
  }

  // 删除任务
  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  // 切换完成状态
  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    ))
  }

  // 过滤任务
  const filterTodos = useCallback((filters: TodoFilters) => {
    return todos.filter(todo => {
      // 状态过滤
      if (filters.status !== 'all') {
        const isCompleted = filters.status === 'completed'
        if (todo.completed !== isCompleted) return false
      }

      // 优先级过滤
      if (filters.priority && todo.priority !== filters.priority) {
        return false
      }

      // 搜索过滤
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!todo.title.toLowerCase().includes(searchLower) &&
            !todo.description?.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      // 标签过滤
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some(tag => todo.tags.includes(tag))) {
          return false
        }
      }

      return true
    })
  }, [todos])

  // 获取统计信息
  const getStats = useCallback(() => {
    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const active = total - completed
    const today = new Date().toDateString()
    const dueToday = todos.filter(t => 
      t.dueDate && new Date(t.dueDate).toDateString() === today && !t.completed
    ).length

    return { total, completed, active, dueToday }
  }, [todos])

  return {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    filterTodos,
    getStats
  }
}