'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Clock, Coffee } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePomodoro } from './usePomodoro'
import ParticleCelebration from './ParticleCelebration'
import { showNotification, playNotificationSound, vibrate } from './notifications'

interface PomodoroTimerProps {
  workMinutes?: number
  breakMinutes?: number
}

export default function PomodoroTimer({ 
  workMinutes = 25, 
  breakMinutes = 5 
}: PomodoroTimerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const {
    timeLeft,
    totalTime,
    state,
    isBreak,
    sessionCount,
    toggle,
    reset,
    formatTime
  } = usePomodoro(workMinutes, breakMinutes)

  const progress = ((totalTime - timeLeft) / totalTime) * 100

  useEffect(() => {
    if (state === 'completed') {
      if (!isBreak) {
        // 工作完成
        setShowCelebration(true)
        showNotification('🍅 番茄钟完成！', {
          body: '太棒了！专注时间已完成，休息一下吧 😌',
          icon: '/favicon.ico'
        })
      } else {
        // 休息完成
        showNotification('☕ 休息时间结束', {
          body: '休息好了吗？开始下一个番茄钟吧 💪',
          icon: '/favicon.ico'
        })
      }
      
      playNotificationSound()
      vibrate([200, 100, 200])
    }
  }, [state, isBreak])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isExpanded) return
      
      switch (event.code) {
        case 'Space':
          event.preventDefault()
          toggle()
          break
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            reset()
          }
          break
        case 'Escape':
          setIsExpanded(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isExpanded, toggle, reset])

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const getButtonIcon = () => {
    switch (state) {
      case 'running':
        return <Pause className="w-5 h-5" />
      case 'paused':
      case 'idle':
        return <Play className="w-5 h-5" />
      default:
        return <Play className="w-5 h-5" />
    }
  }

  return (
    <>
      {/* 悬浮按钮 */}
      {!isExpanded && (
        <button
          onClick={handleToggleExpand}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-pulse"
        >
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            {isBreak ? (
              <Coffee className="w-8 h-8 text-white drop-shadow-lg" />
            ) : (
              <Clock className="w-8 h-8 text-white drop-shadow-lg" />
            )}
          </div>
          
          {/* 会话计数徽章 */}
          {sessionCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              {sessionCount}
            </div>
          )}
        </button>
      )}

      {/* 计时器面板 */}
      {isExpanded && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 50%, rgba(245, 158, 11, 0.3) 100%)`,
              boxShadow: 
                '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(236, 72, 153, 0.2), 0 0 60px rgba(245, 158, 11, 0.1)',
            }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleToggleExpand}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
            >
              <span className="text-lg font-bold">×</span>
            </button>

            {/* 标题 */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white drop-shadow-lg">
                {isBreak ? '😌 休息时间' : '💪 专注时间'}
              </h3>
              <p className="text-sm text-white/70 mt-1">
                已完成 {sessionCount} 个番茄钟
              </p>
            </div>

            {/* 时间显示 */}
            <div className="text-center mb-6"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '160px',
                height: '160px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="text-4xl font-mono font-bold text-white drop-shadow-lg"
                style={{
                  background: 'linear-gradient(45deg, #FF6B35, #00D4FF, #FF297F)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* 进度条 */}
            <div className="mb-6"
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, #FF6B35, #00D4FF, #FF297F)`,
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                  boxShadow: '0 0 10px rgba(255, 107, 53, 0.5)',
                }}
              />
            </div>

            {/* 控制按钮 */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={toggle}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  {getButtonIcon()}
                  <span>{state === 'running' ? '暂停' : '开始'}</span>
                </div>
              </button>

              <button
                onClick={reset}
                className="px-4 py-2 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>重置</span>
                </div>
              </button>
            </div>

            {/* 快捷键提示 */}
            <div className="text-center mt-4 text-xs text-white/60">
              快捷键: <kbd className="px-1 py-0.5 bg-white/20 rounded">空格</kbd> 开始/暂停 | 
              <kbd className="px-1 py-0.5 bg-white/20 rounded">Esc</kbd> 关闭 | 
              <kbd className="px-1 py-0.5 bg-white/20 rounded">Ctrl+R</kbd> 重置
            </div>
          </div>
        </div>
      )}
      <ParticleCelebration 
        isVisible={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
    </>
  )
}