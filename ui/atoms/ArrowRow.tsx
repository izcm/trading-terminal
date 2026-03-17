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

  return (
    <li ref={ref} tabIndex={isSelected ? 0 : -1} onClick={onSelect} className={className}>
      {children}
    </li>
  )
}
