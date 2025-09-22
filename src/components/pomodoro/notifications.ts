export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.log('浏览器不支持通知')
    return 'denied'
  }

  let permission = Notification.permission
  
  if (permission === 'default') {
    permission = await Notification.requestPermission()
  }
  
  return permission
}

export const showNotification = async (
  title: string,
  options: NotificationOptions = {}
): Promise<void> => {
  const permission = await requestNotificationPermission()
  
  if (permission === 'granted') {
    try {
      await new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      })
    } catch (error) {
      console.error('显示通知失败:', error)
    }
  }
}

export const playNotificationSound = () => {
  // 创建音频上下文
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  // 创建简单的提示音
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
}

export const vibrate = (pattern: number | number[] = 200) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}