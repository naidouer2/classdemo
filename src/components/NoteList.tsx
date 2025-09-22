"use client"

import { Note } from '@/types/note'
import { NoteListItem } from './NoteListItem'

interface NoteListProps {
  notes: Note[]
  selectedNoteId?: string
  onSelectNote: (noteId: string) => void
  onDeleteNote: (noteId: string) => void
}

export function NoteList({ notes, selectedNoteId, onSelectNote, onDeleteNote }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <div className="text-3xl">📋</div>
          </div>
          <h3 className="text-gray-600 font-semibold mb-2">暂无笔记</h3>
          <p className="text-gray-500 text-sm">点击左侧的&quot;新建笔记&quot;开始创建吧！</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm px-6 py-4 border-b border-white/30">
        <h2 className="font-bold text-gray-800 text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          所有笔记 ({notes.length})
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes.map(note => (
          <NoteListItem
            key={note.id}
            note={note}
            isSelected={selectedNoteId === note.id}
            onSelect={() => onSelectNote(note.id)}
            onDelete={onDeleteNote}
          />
        ))}
      </div>
    </div>
  )
}