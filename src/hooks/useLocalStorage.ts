import { useState, useEffect } from 'react'
import { UseLocalStorageOptions } from '@/types/note'

export function useLocalStorage<T>({ key, defaultValue, storage = typeof window !== 'undefined' ? window.localStorage : undefined }: UseLocalStorageOptions<T>) {
  // 始终使用defaultValue作为初始状态，避免水合错误
  const [value, setValue] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // 在客户端初始化时从localStorage读取数据
  useEffect(() => {
    if (!storage || isInitialized) return
    
    try {
      const item = storage.getItem(key)
      if (item) {
        const parsedValue = JSON.parse(item)
        setValue(parsedValue)
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsInitialized(true)
    }
  }, [key, storage, isInitialized])

  const setStoredValue = (newValue: T | ((prevValue: T) => T)) => {
    if (!storage) return

    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue
      setValue(valueToStore)
      storage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeStoredValue = () => {
    if (!storage) return

    try {
      storage.removeItem(key)
      setValue(defaultValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [value, setStoredValue, removeStoredValue] as const
}