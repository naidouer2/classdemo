"use client"

import { useState } from 'react'
import { Calendar, Clock, Flag, CheckCircle, Circle, AlertCircle, Plus, Edit3, Trash2, Link2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Project, ProjectTask } from '@/types/project'

interface ProjectDetailProps {
  project: Project | undefined
  onUpdateProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
}

export function ProjectDetail({ project, onUpdateProject, onDeleteProject }: ProjectDetailProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<ProjectTask['priority']>('medium')
  const [showTaskForm, setShowTaskForm] = useState(false)

  if (!project) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm h-full">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Folder className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">选择一个项目</h3>
          <p className="text-gray-600">从左侧列表中选择一个项目查看详情</p>
        </CardContent>
      </Card>
    )
  }

  const getTaskStatusIcon = (status: ProjectTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: ProjectTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'todo',
      priority: newTaskPriority,
      createdAt: new Date().toISOString()
    }

    const updatedProject = {
      ...project,
      tasks: [...project.tasks, newTask],
      updatedAt: new Date().toISOString()
    }

    onUpdateProject(updatedProject)
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskPriority('medium')
    setShowTaskForm(false)
  }

  const updateTaskStatus = (taskId: string, status: ProjectTask['status']) => {
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId 
        ? { 
            ...task, 
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined
          }
        : task
    )

    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    }

    onUpdateProject(updatedProject)
  }

  const deleteTask = (taskId: string) => {
    if (!confirm('确定要删除这个任务吗？')) return

    const updatedTasks = project.tasks.filter(task => task.id !== taskId)
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    }

    onUpdateProject(updatedProject)
  }

  const updateProjectField = (field: keyof Project, value: any) => {
    const updatedProject = {
      ...project,
      [field]: value,
      updatedAt: new Date().toISOString()
    }
    onUpdateProject(updatedProject)
  }

  const completedTasks = project.tasks.filter(task => task.status === 'completed').length
  const totalTasks = project.tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                {project.name}
              </CardTitle>
              <Textarea
                value={project.description}
                onChange={(e) => updateProjectField('description', e.target.value)}
                className="text-sm text-gray-600 bg-transparent border-none resize-none min-h-[60px] p-0 focus:ring-0"
                placeholder="项目描述..."
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('确定要删除这个项目吗？此操作不可撤销。')) {
                  onDeleteProject(project.id)
                }
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Status and Priority */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">状态:</span>
                <Select
                  value={project.status}
                  onValueChange={(value) => updateProjectField('status', value)}
                >
                  <SelectTrigger className="w-24 h-8 text-sm">
                    <SelectValue>{project.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">进行中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="paused">已暂停</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">优先级:</span>
                <Select
                  value={project.priority}
                  onValueChange={(value) => updateProjectField('priority', value)}
                >
                  <SelectTrigger className="w-20 h-8 text-sm">
                    <SelectValue>{project.priority}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>开始: {new Date(project.startDate).toLocaleDateString('zh-CN')}</span>
              </div>
              {project.endDate && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>结束: {new Date(project.endDate).toLocaleDateString('zh-CN')}</span>
                </div>
              )}
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>整体进度</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{completedTasks}/{totalTasks} 任务已完成</p>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">标签:</span>
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">任务列表</CardTitle>
            <Button
              size="sm"
              onClick={() => setShowTaskForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              添加任务
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {showTaskForm && (
            <Card className="bg-gray-50 mb-4">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="任务标题"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="text-sm"
                  />
                  <Textarea
                    placeholder="任务描述（可选）"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="text-sm min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value as ProjectTask['priority'])}>
                      <SelectTrigger className="w-24 h-8 text-sm">
                        <SelectValue>{newTaskPriority}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低优先级</SelectItem>
                        <SelectItem value="medium">中优先级</SelectItem>
                        <SelectItem value="high">高优先级</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={addTask}>添加</Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowTaskForm(false)}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {project.tasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">暂无任务，点击&ldquo;添加任务&rdquo;开始规划</p>
            ) : (
              project.tasks.map((task) => (
                <Card key={task.id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 w-6 mt-0.5"
                        onClick={() => updateTaskStatus(
                          task.id, 
                          task.status === 'completed' ? 'todo' : 'completed'
                        )}
                      >
                        {getTaskStatusIcon(task.status)}
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                            <p className="font-medium text-sm">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-6 w-6 text-red-600 hover:text-red-700"
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Associated Notes */}
      {project.notes.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              关联笔记
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {project.notes.map((noteId, index) => (
                <Card key={index} className="bg-gray-50"
                  onClick={() => {
                    // 跳转到对应笔记的逻辑
                    console.log('跳转到笔记:', noteId)
                  }}
                >
                  <CardContent className="p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">笔记 #{noteId.substr(0, 8)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// 添加缺失的导入
import { Folder } from 'lucide-react'