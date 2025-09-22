"use client"

import { useState, useEffect } from 'react'
import { Plus, Folder, Calendar, Flag, Users, BarChart3, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Project, ProjectFilter } from '@/types/project'
import { ProjectList } from './ProjectList'
import { ProjectDetail } from './ProjectDetail'
import { ProjectForm } from './ProjectForm'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export function ProjectManagement() {
  const [projects, setProjects] = useLocalStorage<Project[]>({ key: 'projects', defaultValue: [] })
  const [selectedProjectId, setSelectedProjectId] = useState<string>()
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [filter, setFilter] = useState<ProjectFilter>({})
  const [searchTerm, setSearchTerm] = useState('')

  const selectedProject = projects.find(project => project.id === selectedProjectId)

  const filteredProjects = projects.filter(project => {
    // 搜索过滤
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // 状态过滤
    if (filter.status && filter.status.length > 0 && !filter.status.includes(project.status)) {
      return false
    }

    // 优先级过滤
    if (filter.priority && filter.priority.length > 0 && !filter.priority.includes(project.priority)) {
      return false
    }

    // 标签过滤
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some(tag => project.tags.includes(tag))
      if (!hasMatchingTag) return false
    }

    return true
  })

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'paused': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    highPriority: projects.filter(p => p.priority === 'high' || p.priority === 'urgent').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">项目管理</h1>
              <p className="text-gray-600">管理和跟踪您的所有项目进度</p>
            </div>
            <Button 
              onClick={() => setShowProjectForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              新建项目
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">总项目</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Folder className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">进行中</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">已完成</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">高优先级</p>
                    <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
                  </div>
                  <Flag className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索项目名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <Select
              value={filter.status?.join(',') || 'all'}
              onValueChange={(value) => {
                if (value === 'all') {
                  setFilter({ ...filter, status: undefined })
                } else {
                  setFilter({ ...filter, status: value.split(',') as Project['status'][] })
                }
              }}
            >
              <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm">
                <SelectValue>状态</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">进行中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="paused">已暂停</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.priority?.join(',') || 'all'}
              onValueChange={(value) => {
                if (value === 'all') {
                  setFilter({ ...filter, priority: undefined })
                } else {
                  setFilter({ ...filter, priority: value.split(',') as Project['priority'][] })
                }
              }}
            >
              <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm">
                <SelectValue>优先级</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="urgent">紧急</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project List */}
          <div className="lg:col-span-2">
            <ProjectList 
              projects={filteredProjects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          </div>

          {/* Project Detail */}
          <div className="lg:col-span-1">
            <ProjectDetail 
              project={selectedProject}
              onUpdateProject={(updatedProject) => {
                setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p))
              }}
              onDeleteProject={(projectId) => {
                setProjects(projects.filter(p => p.id !== projectId))
                if (selectedProjectId === projectId) {
                  setSelectedProjectId(undefined)
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          onClose={() => setShowProjectForm(false)}
          onSave={(project) => {
            setProjects([...projects, project])
            setShowProjectForm(false)
          }}
        />
      )}
    </div>
  )
}