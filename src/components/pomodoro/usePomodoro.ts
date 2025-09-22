import { useState, useEffect, useRef, useCallback } from 'react'

export type TimerState = 'idle' | 'running' | 'paused' | 'completed' | 'break'

export interface PomodoroState {
  timeLeft: number
  totalTime: number
  state: TimerState
  isBreak: boolean
  sessionCount: number
}

interface UsePomodoroReturn extends PomodoroState {
  start: () => void
  pause: () => void
  reset: () => void
  toggle: () => void
  formatTime: (seconds: number) => string
}

const WORK_MINUTES = 25
const BREAK_MINUTES = 5

export const usePomodoro = (
  workMinutes = WORK_MINUTES,
  breakMinutes = BREAK_MINUTES
): UsePomodoroReturn => {
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60)
  const [totalTime, setTotalTime] = useState(workMinutes * 60)
  const [state, setState] = useState<TimerState>('idle')
  const [isBreak, setIsBreak] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const start = useCallback(() => {
    if (state === 'paused' || state === 'idle') {
      setState('running')
    }
  }, [state])

  const pause = useCallback(() => {
    if (state === 'running') {
      setState('paused')
    }
  }, [state])

  const reset = useCallback(() => {
    setState('idle')
    setTimeLeft(isBreak ? breakMinutes * 60 : workMinutes * 60)
    setTotalTime(isBreak ? breakMinutes * 60 : workMinutes * 60)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isBreak, workMinutes, breakMinutes])

  const toggle = useCallback(() => {
    if (state === 'running') {
      pause()
    } else {
      start()
    }
  }, [state, start, pause])

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setState('completed')
            
            if (!isBreak) {
              setSessionCount((prev) => prev + 1)
            }
            
            // 延迟切换到下一个阶段
            setTimeout(() => {
              setIsBreak((prev) => !prev)
              const nextTime = isBreak ? workMinutes * 60 : breakMinutes * 60
              setTimeLeft(nextTime)
              setTotalTime(nextTime)
              setState('idle')
            }, 2000) // 2秒后自动切换
            
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state, isBreak, workMinutes, breakMinutes])

  useEffect(() => {
    setTotalTime(isBreak ? breakMinutes * 60 : workMinutes * 60)
  }, [isBreak, workMinutes, breakMinutes])

  return {
    timeLeft,
    totalTime,
    state,
    isBreak,
    sessionCount,
    start,
    pause,
    reset,
    toggle,
    formatTime
  }
}