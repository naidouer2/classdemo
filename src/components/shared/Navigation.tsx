'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/notes',
      label: '记事本',
      icon: FileText,
      active: pathname === '/notes' || pathname === '/'
    },
    {
      href: '/todo',
      label: '待办清单',
      icon: CheckSquare,
      active: pathname === '/todo'
    }
  ]

  return (
    <nav className="border-b bg-white">
      <div className="px-6 py-3">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-gray-900">AI工具箱</h1>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}