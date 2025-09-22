export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  startDate: string
  endDate?: string
  progress: number // 0-100
  notes: string[] // 关联的笔记ID
  tasks: ProjectTask[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProjectTask {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  completedAt?: string
  createdAt: string
}

export interface ProjectFilter {
  status?: Project['status'][]
  priority?: Project['priority'][]
  tags?: string[]
  searchTerm?: string
}