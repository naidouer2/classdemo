'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, CheckSquare, MessageSquare, Timer, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/notes',
      label: '记事本',
      icon: FileText,
      active: pathname === '/notes' || pathname === '/'
    },
    {
      href: '/todo',
      label: '待办',
      icon: CheckSquare,
      active: pathname === '/todo'
    },
    {
      href: '/chat',
      label: 'AI对话',
      icon: MessageSquare,
      active: pathname === '/chat' || pathname.startsWith('/chat/')
    },
    {
      href: '/pomodoro',
      label: '番茄钟',
      icon: Timer,
      active: pathname === '/pomodoro'
    },
    {
      href: '/settings',
      label: '设置',
      icon: Settings,
      active: pathname === '/settings'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 backdrop-blur-xl border-t border-white/20 z-50 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-3 px-4 rounded-2xl',
                'transition-all duration-200 min-w-[70px] group relative',
                item.active
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/20 hover:scale-105'
              )}
            >
              {item.active && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"
                  style={{
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6)'
                  }}
                ></div>
              )}
              <div className="relative"
                style={{
                  filter: item.active ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' : ''
                }}
              >
                <Icon className={cn(
                  'w-5 h-5 mb-1 transition-all duration-200',
                  item.active ? 'text-white' : 'group-hover:scale-110'
                )} />
                <span className={cn(
                  'text-xs font-medium transition-all duration-200',
                  item.active ? 'text-white font-semibold' : 'group-hover:font-semibold'
                )}
                  style={{
                    textShadow: item.active ? '0 0 10px rgba(255, 255, 255, 0.5)' : ''
                  }}
                >{item.label}</span>
              </div>
              
              {!item.active && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
                  }}
                ></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}