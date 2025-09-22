import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI工具箱',
  description: 'AI 驱动的智能记事本、待办清单和AI对话应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <div className="pb-20">
          {children}
        </div>
        <Navigation />
      </body>
    </html>
  )
}