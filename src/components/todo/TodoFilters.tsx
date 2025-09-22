'use client'

import { Search, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TodoFilters as Filters } from '@/types/todo'

interface TodoFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  availableTags: string[]
}

export function TodoFilters({ filters, onFiltersChange, availableTags }: TodoFiltersProps) {
  const handleStatusChange = (status: Filters['status']) => {
    onFiltersChange({ ...filters, status })
  }

  const handlePriorityChange = (priority: Filters['priority']) => {
    onFiltersChange({ ...filters, priority })
  }

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    onFiltersChange({ ...filters, tags: newTags })
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
        筛选
      </div>
      
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="搜索任务..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-white/60 border-white/40 focus:border-purple-300 focus:ring-purple-200 rounded-lg"
        />
      </div>

      {/* 状态筛选 */}
      <div>
        <div className="text-xs font-semibold text-gray-600 mb-3">状态</div>
        <div className="flex space-x-2">
          {(['all', 'active', 'completed'] as const).map(status => (
            <Button
              key={status}
              size="sm"
              variant={filters.status === status ? 'default' : 'outline'}
              onClick={() => handleStatusChange(status)}
              className={`flex-1 text-xs rounded-lg transition-all duration-200 ${
                filters.status === status 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md border-0' 
                  : 'bg-white/60 border-white/40 text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300'
              }`}
            >
              {status === 'all' ? '全部' : status === 'active' ? '待办' : '已完成'}
            </Button>
          ))}
        </div>
      </div>

      {/* 优先级筛选 */}
      <div>
        <div className="text-xs font-semibold text-gray-600 mb-3">优先级</div>
        <div className="flex space-x-2">
          {(['low', 'medium', 'high'] as const).map(priority => (
            <Button
              key={priority}
              size="sm"
              variant={filters.priority === priority ? 'default' : 'outline'}
              onClick={() => handlePriorityChange(filters.priority === priority ? undefined : priority)}
              className={`flex-1 text-xs rounded-lg transition-all duration-200 ${
                filters.priority === priority 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md border-0' 
                  : 'bg-white/60 border-white/40 text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300'
              }`}
            >
              {priority === 'low' ? '低' : priority === 'medium' ? '中' : '高'}
            </Button>
          ))}
        </div>
      </div>

      {/* 标签筛选 */}
      {availableTags.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-3 flex items-center">
            <Tag className="w-3 h-3 mr-1" />
            标签
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <Button
                key={tag}
                size="sm"
                variant={filters.tags?.includes(tag) ? 'default' : 'outline'}
                onClick={() => handleTagToggle(tag)}
                className={`text-xs rounded-full transition-all duration-200 ${
                  filters.tags?.includes(tag)
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md border-0'
                    : 'bg-white/60 border-white/40 text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300'
                }`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 清除筛选 */}
      {(filters.search || filters.priority || (filters.tags && filters.tags.length > 0)) && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onFiltersChange({ status: filters.status })}
          className="w-full text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-2"
        >
          清除筛选
        </Button>
      )}
    </div>
  )
}