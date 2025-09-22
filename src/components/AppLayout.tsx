"use client"

import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Sidebar } from './Sidebar'
import { NoteList } from './NoteList'
import { Editor } from './Editor'
import { Settings } from './Settings'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Note } from '@/types/note'
import { AIAPI, APIKeyManager } from '@/lib/api'
import { Card } from '@/components/ui/card'

export function AppLayout() {
  const [notes, setNotes] = useLocalStorage<Note[]>({ key: 'notes', defaultValue: [] })
  const [selectedNoteId, setSelectedNoteId] = useState<string>()
  const [showSettings, setShowSettings] = useState(false)
  const [aiAPI, setAiAPI] = useState<AIAPI | null>(null)

  // 初始化 AI API
  useEffect(() => {
    const apiKey = APIKeyManager.getKey()
    if (apiKey) {
      setAiAPI(new AIAPI(apiKey))
    }
  }, [])

  const selectedNote = notes.find(note => note.id === selectedNoteId)

  const handleNewNote = useCallback(() => {
    const newNote: Note = {
      id: uuidv4(),
      title: '',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes(prev => [newNote, ...prev])
    setSelectedNoteId(newNote.id)
  }, [setNotes])

  const handleSelectNote = useCallback((noteId: string) => {
    setSelectedNoteId(noteId)
  }, [])

  const handleUpdateNote = useCallback((updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ))
  }, [setNotes])

  const handleDeleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId))
    if (selectedNoteId === noteId) {
      setSelectedNoteId(undefined)
    }
  }, [setNotes, selectedNoteId])

  const handleGenerateTitle = useCallback(async (content: string) => {
    if (!aiAPI) throw new Error('AI API 未配置')
    return await aiAPI.generateTitle(content)
  }, [aiAPI])

  const handleGenerateTags = useCallback(async (content: string) => {
    if (!aiAPI) throw new Error('AI API 未配置')
    return await aiAPI.generateTags(content)
  }, [aiAPI])

  const handlePolishContent = useCallback(async (content: string) => {
    if (!aiAPI) throw new Error('AI API 未配置')
    return await aiAPI.polishContent(content)
  }, [aiAPI])

  const handleSaveSettings = useCallback((apiKey: string) => {
    if (apiKey) {
      APIKeyManager.setKey(apiKey)
      setAiAPI(new AIAPI(apiKey))
    } else {
      APIKeyManager.removeKey()
      setAiAPI(null)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 h-screen flex gap-4 p-4">
        {/* Sidebar */}
        <Card className="w-64 bg-white/70 backdrop-blur-xl border-white/20 overflow-hidden">
          <Sidebar
            notes={notes}
            onNewNote={handleNewNote}
            onSelectNote={handleSelectNote}
            selectedNoteId={selectedNoteId}
            onOpenSettings={() => setShowSettings(true)}
          />
        </Card>

        {/* Note List */}
        <Card className="w-80 bg-white/70 backdrop-blur-xl border-white/20 overflow-hidden">
          <NoteList
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onDeleteNote={handleDeleteNote}
          />
        </Card>

        {/* Editor */}
        <Card className="flex-1 bg-white/70 backdrop-blur-xl border-white/20 overflow-hidden">
          <Editor
            note={selectedNote || null}
            onUpdateNote={handleUpdateNote}
            onGenerateTitle={handleGenerateTitle}
            onGenerateTags={handleGenerateTags}
            onPolishContent={handlePolishContent}
          />
        </Card>
      </div>

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  )
}