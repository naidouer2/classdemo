import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
}

interface ParticleCelebrationProps {
  isVisible: boolean
  onComplete: () => void
}

const colors = [
  '#FF6B35', '#FF297F', '#00D4FF', '#8B5CF6', 
  '#EC4899', '#F59E0B', '#10B981', '#3B82F6'
]

export default function ParticleCelebration({ isVisible, onComplete }: ParticleCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (isVisible) {
      // 创建粒子
      const newParticles: Particle[] = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: 50 + (Math.random() - 0.5) * 20,
          y: 50 + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 200,
          vy: (Math.random() - 0.5) * 200 - 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 2,
          life: 1
        })
      }
      setParticles(newParticles)

      // 动画循环
      const animate = () => {
        setParticles(prev => {
          const updated = prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx * 0.016,
            y: particle.y + particle.vy * 0.016,
            vy: particle.vy + 300 * 0.016, // 重力
            life: particle.life - 0.02
          })).filter(particle => particle.life > 0)

          if (updated.length === 0) {
            onComplete()
            return []
          }
          return updated
        })
      }

      const interval = setInterval(animate, 16)
      return () => clearInterval(interval)
    }
  }, [isVisible, onComplete])

  if (!isVisible || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50"
      style={{ 
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px'
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: particle.life,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transition: 'none'
          }}
        />
      ))}
    </div>
  )
}