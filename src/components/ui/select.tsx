"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  defaultValue?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
  id?: string
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

// 简化的Select组件
export function Select({ children, value, onValueChange, defaultValue }: SelectProps) {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || '')
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue)
    setIsOpen(false)
    onValueChange?.(newValue)
  }

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            selectedValue
          } as any)
        }
        if (React.isValidElement(child) && child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen,
            selectedValue,
            onSelect: handleSelect
          } as any)
        }
        return child
      })}
    </div>
  )
}

export function SelectTrigger({ children, className, onClick, selectedValue, id }: SelectTriggerProps & { onClick?: () => void, selectedValue?: string, id?: string }) {
  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      onClick={onClick}
    >
      <span>{selectedValue}</span>
      {id && <input type="hidden" id={id} value={selectedValue} />}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectContent({ children, isOpen, selectedValue, onSelect, className }: SelectContentProps & { 
  isOpen?: boolean
  selectedValue?: string
  onSelect?: (value: string) => void
}) {
  if (!isOpen) return null

  return (
    <div className={`absolute z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ${className || ''}`}>
      <div className="p-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            return React.cloneElement(child, {
              onSelect,
              isSelected: child.props.value === selectedValue
            } as any)
          }
          return child
        })}
      </div>
    </div>
  )
}

export function SelectItem({ children, value, className, onSelect, isSelected }: SelectItemProps & { 
  onSelect?: (value: string) => void
  isSelected?: boolean
}) {
  return (
    <button
      type="button"
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ''}`}
      onClick={() => onSelect?.(value)}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && '✓'}
      </span>
      {children}
    </button>
  )
}

export function SelectValue({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}