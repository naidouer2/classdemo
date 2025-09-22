"use client"

import { useState } from 'react'
import { Plus, Settings, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Note } from '@/types/note'

interface SidebarProps {
  notes: Note[]
  onNewNote: () => void
  onSelectNote: (noteId: string) => void
  selectedNoteId?: string
  onOpenSettings: () => void
}

export function Sidebar({ notes, onNewNote, onSelectNote, selectedNoteId, onOpenSettings }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            记事本
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="p-2 h-9 w-9 rounded-xl hover:bg-white/50 transition-all duration-200"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
        
        <Button
          onClick={onNewNote}
          className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          新建笔记
        </Button>
      </div>

      <div className="px-6 pb-4">
        <input
          type="text"
          placeholder="🔍 搜索笔记..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {filteredNotes.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            {searchQuery ? '没有找到匹配的笔记' : '还没有笔记，点击上方按钮创建吧！'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedNoteId === note.id
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 shadow-md transform scale-105'
                    : 'bg-white/30 hover:bg-white/50 hover:shadow-lg hover:transform hover:scale-102'
                }`}
              >
                <h3 className="font-semibold text-sm truncate mb-2 text-gray-800">
                  {note.title || '无标题'}
                </h3>
                <p className="text-xs text-gray-500 truncate mb-2">
                  {new Date(note.updatedAt).toLocaleDateString('zh-CN')}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {note.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 px-2 py-1 rounded-lg font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="text-xs text-purple-500 font-medium">+{note.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}