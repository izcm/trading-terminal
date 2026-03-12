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

  const state = isSelected ? 'bg-accent/8' : 'hover:bg-white/5 bg-secondary/50'

  return (
    <li
      ref={ref}
      tabIndex={isSelected ? 0 : -1}
      onClick={onSelect}
      aria-selected={isSelected}
      className={`${state} ${className}`}
    >
      {children}
    </li>
  )
}
