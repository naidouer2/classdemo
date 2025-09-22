"use client"

import * as React from "react"

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
  onClick?: () => void
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'end' | 'center'
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
}

// 简化的DropdownMenu组件
export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative">{children}</div>
}

export function DropdownMenuTrigger({ children, asChild, className, onClick }: DropdownMenuTriggerProps) {
  const triggerContent = asChild ? children : (
    <button
      type="button"
      className={`flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
  return <>{triggerContent}</>
}

export function DropdownMenuContent({ children, className, align = 'center' }: DropdownMenuContentProps) {
  return (
    <div className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className || ''}`}
      style={{ 
        top: '100%', 
        [align === 'start' ? 'left' : align === 'end' ? 'right' : 'left']: align === 'center' ? '50%' : '0',
        transform: align === 'center' ? 'translateX(-50%)' : 'none'
      }}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, className, onClick, disabled }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`px-2 py-1.5 text-sm font-semibold ${className || ''}`}>{children}</div>
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={`-mx-1 my-1 h-px bg-muted ${className || ''}`} />
}