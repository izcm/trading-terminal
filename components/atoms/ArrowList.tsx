import type { ReactNode } from 'react'
type ArrowListProps<T> = {
  items: T[]
  getId: (item: T) => string
  selectedId: string | null
  onSelect: (item: T) => void
  children: (args: { item: T; isSelected: boolean; onSelect: () => void }) => ReactNode
  className?: string
}

export function ArrowList<T>({
  items,
  getId,
  selectedId,
  onSelect,
  children,
  className = '',
}: ArrowListProps<T>) {
  const base = 'card overflow-y-auto no-scrollbar'
  return (
    <ul
      className={`${base} ${className}`}
      tabIndex={0}
      onKeyDown={e => {
        if (!items.length) return

        if (e.key === 'Home') {
          e.preventDefault()
          onSelect(items[0])
          return
        }

        if (e.key === 'End') {
          e.preventDefault()
          onSelect(items[items.length - 1])
          return
        }

        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
        e.preventDefault()

        const index = items.findIndex(it => getId(it) === selectedId)
        if (index === -1) return

        let next = index
        if (e.key === 'ArrowDown') next = Math.min(index + 1, items.length - 1)
        if (e.key === 'ArrowUp') next = Math.max(index - 1, 0)

        onSelect(items[next])
      }}
    >
      {items.map(item => {
        const isSelected = selectedId !== null && getId(item) === selectedId

        return children({ item, isSelected, onSelect: () => onSelect(item) })
      })}
    </ul>
  )
}
