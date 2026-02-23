import { ReactNode, useEffect, useRef } from 'react'

type ArrowRowProps = {
  selected: boolean
  onSelect: () => void
  children: ReactNode
  className: string
}

export function ArrowRow({
  selected,
  onSelect,
  children,
  className = `
        w-full base-row gap-4 p-2 rounded-md transition 
        ${selected ? 'bg-white/5' : 'hover:bg-white/5'}
    `,
}: ArrowRowProps) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (selected) {
      ref.current?.focus()
    }
  }, [selected])

  return (
    <li
      ref={ref}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      aria-selected={selected}
      className={className}
    >
      {children}
    </li>
  )
}
