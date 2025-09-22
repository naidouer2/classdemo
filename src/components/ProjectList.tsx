"use client"

import { Calendar, Clock, Flag, MoreHorizontal, Edit, Trash2, Eye, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Project } from '@/types/project'

interface ProjectListProps {
  projects: Project[]
  selectedProjectId?: string
  onSelectProject: (projectId: string) => void
  getStatusColor: (status: Project['status']) => string
  getPriorityColor: (priority: Project['priority']) => string
}

export function ProjectList({ 
  projects, 
  selectedProjectId, 
  onSelectProject, 
  getStatusColor, 
  getPriorityColor 
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Folder className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无项目</h3>
          <p className="text-gray-600">点击&ldquo;新建项目&rdquo;按钮创建您的第一个项目</p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysRemaining = (endDate?: string) => {
    if (!endDate) return null
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const daysRemaining = getDaysRemaining(project.endDate)
        const isSelected = selectedProjectId === project.id

        return (
          <Card 
            key={project.id} 
            className={`bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:bg-white/90'
            }`}
            onClick={() => onSelectProject(project.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={() => {}}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectProject(project.id); }}>
                      <Eye className="mr-2 h-4 w-4" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Edit className="mr-2 h-4 w-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('确定要删除这个项目吗？此操作不可撤销。')) {
                          // 触发删除逻辑
                        }
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Tags and Priority */}
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`${getPriorityColor(project.priority)} border-none`}>
                  <Flag className="w-3 h-3 mr-1" />
                  {project.priority === 'urgent' ? '紧急' : 
                   project.priority === 'high' ? '高' :
                   project.priority === 'medium' ? '中' : '低'}
                </Badge>
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>进度</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Dates and Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.startDate)}</span>
                  </div>
                  {project.endDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className={daysRemaining !== null && daysRemaining < 7 ? 'text-red-600 font-medium' : ''}>
                        {daysRemaining !== null ? 
                          (daysRemaining >= 0 ? `剩余${daysRemaining}天` : `逾期${Math.abs(daysRemaining)}天`) :
                          formatDate(project.endDate)
                        }
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span>{project.tasks.length} 任务</span>
                  {project.notes.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{project.notes.length} 笔记</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}