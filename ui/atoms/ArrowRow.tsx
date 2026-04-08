import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

type ArrowRowProps = {
  isSelected: boolean
  onSelect: () => void
  children: ReactNode
  className?: string
  dataId?: string
}

export function ArrowRow({ isSelected, onSelect, children, className, dataId }: ArrowRowProps) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (isSelected) {
      ref.current?.focus()
    }
  }, [isSelected])

  const appliedClasses =
    className ??
    clsx(
      // default
      !isSelected && 'hover:bg-white/15 bg-secondary/80',
      // selected
      isSelected && 'bg-accent/20'
    )

  return (
    <li
      ref={ref}
      data-id={dataId}
      tabIndex={isSelected ? 0 : -1}
      onClick={onSelect}
      className={appliedClasses}
    >
      {children}
    </li>
  )
}
