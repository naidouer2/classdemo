export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface AIResponse {
  title?: string
  tags?: string[]
  content?: string
}

export interface UseLocalStorageOptions<T> {
  key: string
  defaultValue: T
  storage?: Storage
}