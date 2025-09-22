'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Clock, Coffee } from 'lucide-react'

const POMODORO_MINUTES = 25
const BREAK_MINUTES = 5

interface TimerState {
  timeLeft: number
  isRunning: boolean
  isBreak: boolean
  sessionCount: number
}

export default function PomodoroPage() {
  const [state, setState] = useState<TimerState>({
    timeLeft: POMODORO_MINUTES * 60,
    isRunning: false,
    isBreak: false,
    sessionCount: 0
  })
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 开始/暂停计时器
  const toggleTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }))
  }, [])

  // 重置计时器
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setState({
      timeLeft: POMODORO_MINUTES * 60,
      isRunning: false,
      isBreak: false,
      sessionCount: 0
    })
  }, [])

  // 通知功能
  const showNotification = (title: string, options: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { ...options, icon: '/favicon.ico' })
    }
  }

  // 播放提示音
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log('音频播放失败:', error)
    }
  }

  // 计时器逻辑
  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const newTimeLeft = prev.timeLeft - 1
          
          if (newTimeLeft === 0) {
            // 播放提示音
            playNotificationSound()
            
            // 显示通知
            if (!prev.isBreak) {
              showNotification('🍅 番茄钟完成！', {
                body: '太棒了！专注时间已完成，休息一下吧 😌'
              })
            } else {
              showNotification('☕ 休息时间结束', {
                body: '休息好了吗？开始下一个番茄钟吧 💪'
              })
            }
            
            return {
              ...prev,
              timeLeft: prev.isBreak ? POMODORO_MINUTES * 60 : BREAK_MINUTES * 60,
              isRunning: false,
              isBreak: !prev.isBreak,
              sessionCount: prev.isBreak ? prev.sessionCount : prev.sessionCount + 1
            }
          }
          
          return { ...prev, timeLeft: newTimeLeft }
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
  }, [state.isRunning, state.timeLeft])

  // 请求通知权限
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
          event.preventDefault()
          toggleTimer()
          break
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            resetTimer()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggleTimer, resetTimer])

  const progress = state.isBreak 
    ? ((BREAK_MINUTES * 60 - state.timeLeft) / (BREAK_MINUTES * 60)) * 100
    : ((POMODORO_MINUTES * 60 - state.timeLeft) / (POMODORO_MINUTES * 60)) * 100

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      {/* 主要番茄钟面板 */}
      <div 
        className="relative bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-orange-400/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-105 max-w-sm w-full"
        style={{
          boxShadow: 
            '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(245, 158, 11, 0.2)',
        }}
      >
        {/* 标题 */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-3"
            style={{
              background: 'linear-gradient(45deg, #FF6B35, #00D4FF, #FF297F)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            {state.isBreak ? '😌 休息时间' : '💪 专注时间'}
          </h3>
          <p className="text-base text-white/80 font-medium">
            已完成 {state.sessionCount} 个番茄钟
          </p>
        </div>

        {/* 圆形彩虹进度条 */}
        <div className="text-center mb-6">
          <div 
            className="relative w-36 h-36 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg, #FF6B35 ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`,
              }}
            />
            <div className="text-3xl font-mono font-bold text-white drop-shadow-lg relative z-10"
              style={{
                background: 'linear-gradient(45deg, #FF6B35, #00D4FF, #FF297F)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              {formatTime(state.timeLeft)}
            </div>
          </div>
        </div>

        {/* 彩虹进度条 */}
        <div className="mb-6">
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #FF6B35, #00D4FF, #FF297F)`,
                boxShadow: '0 0 8px rgba(255, 107, 53, 0.5)',
              }}
            />
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex gap-3 justify-center items-center">
          <button
            onClick={toggleTimer}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-2xl"
            style={{
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.5), 0 0 30px rgba(236, 72, 153, 0.3)'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              {state.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{state.isRunning ? '暂停' : '开始'}</span>
            </div>
          </button>

          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-white/20 text-white font-bold hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* 快捷键提示 */}
        <div className="text-center mt-4 text-xs text-white/70">
          💡 快捷键: <kbd className="px-1.5 py-0.5 bg-white/20 rounded mx-1 text-xs">空格</kbd> 暂停/开始 |
          <kbd className="px-1.5 py-0.5 bg-white/20 rounded mx-1 text-xs">Ctrl+R</kbd> 重置
        </div>
      </div>

      {/* 番茄钟说明 */}
      <div className="mt-8 text-center max-w-md">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">🍅 番茄工作法</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• 专注工作 25 分钟</p>
            <p>• 短暂休息 5 分钟</p>
            <p>• 重复循环，提高效率</p>
          </div>
        </div>
      </div>
    </div>
  )
}