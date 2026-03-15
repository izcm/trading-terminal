import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

type ArrowRowProps = {
  isSelected: boolean
  onSelect: () => void
  children: ReactNode
  className?: string
}

export function ArrowRow({ isSelected, onSelect, children, className }: ArrowRowProps) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (isSelected) {
      ref.current?.focus()
    }
  }, [isSelected])

  const state = isSelected ? 'bg-accent/25' : 'hover:bg-white/10 bg-secondary/60'

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
