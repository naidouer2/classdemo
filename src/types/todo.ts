export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface TodoCategory {
  id: string
  name: string
  color: string
}

export interface TodoFilters {
  status: 'all' | 'active' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  search?: string
  tags?: string[]
}