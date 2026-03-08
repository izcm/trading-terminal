'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

type ArrowRowProps = {
  isSelected: boolean
  onSelect: () => void
  children: ReactNode
  className?: string
}

export function ArrowRow({ isSelected, onSelect, children, className = '' }: ArrowRowProps) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (isSelected) {
      ref.current?.focus()
    }
  }, [isSelected])

  const base = 'w-full base-row rounded-md transition'
  const interactive = isSelected ? 'bg-white/5' : 'hover:bg-white/5'

  return (
    <li
      ref={ref}
      tabIndex={isSelected ? 0 : -1}
      onClick={onSelect}
      aria-selected={isSelected}
      className={`${base} ${interactive} ${className}`}
    >
      {children}
    </li>
  )
}
