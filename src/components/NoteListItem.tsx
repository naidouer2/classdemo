"use client"

import { MouseEvent } from 'react'
import { Note } from '@/types/note'
import { Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NoteListItemProps {
  note: Note
  isSelected: boolean
  onSelect: () => void
  onDelete: (noteId: string) => void
}

export function NoteListItem({ note, isSelected, onSelect, onDelete }: NoteListItemProps) {
  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (window.confirm('确定要删除这个笔记吗？')) {
      onDelete(note.id)
    }
  }

  const getPreviewText = (content: string) => {
    return content.replace(/[#`*_\-\[\]]/g, '').slice(0, 100) + (content.length > 100 ? '...' : '')
  }

  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer transition-all duration-200 group ${
        isSelected 
          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 shadow-lg transform scale-105' 
          : 'bg-white/50 hover:bg-white/80 hover:shadow-lg hover:transform hover:scale-102 border-white/30'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-gray-800 truncate flex-1 mr-2 text-base">
            {note.title || '无标题笔记'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {getPreviewText(note.content)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Clock className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {new Date(note.updatedAt).toLocaleString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {note.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap max-w-[200px]">
              {note.tags.slice(0, 3).map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 border-none"
                >
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <span className="text-xs text-purple-500 font-medium">+{note.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
