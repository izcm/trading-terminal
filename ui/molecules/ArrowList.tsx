import type { ReactNode } from 'react'
import React from 'react'

type ArrowListProps<T> = {
  items: T[]
  getId: (item: T) => string
  selectedId: string | undefined
  onSelect: (item: T) => void
  children: (args: { item: T; isSelected: boolean; onSelect: () => void }) => ReactNode
  className?: string
  ref?: React.Ref<HTMLUListElement>
  direction?: 'vertical' | 'horizontal'
}

export function ArrowList<T>({
  items,
  getId,
  selectedId,
  onSelect,
  children,
  className = '',
  ref,
  direction = 'vertical',
}: ArrowListProps<T>) {
  const base = 'overflow-y-auto no-scrollbar'
  const [prevKey, nextKey] =
    direction === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown']

  return (
    <ul
      ref={ref}
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

        if (e.key !== prevKey && e.key !== nextKey) return
        e.preventDefault()

        const index = selectedId === undefined ? 0 : items.findIndex(it => getId(it) === selectedId)

        if (index === -1) return

        let next = index

        if (e.key === nextKey) next = Math.min(index + 1, items.length - 1)
        if (e.key === prevKey) next = Math.max(index - 1, 0)

        onSelect(items[next])
      }}
    >
      {items.map(item => {
        const isSelected = selectedId !== undefined && getId(item) === selectedId

        return children({ item, isSelected, onSelect: () => onSelect(item) })
      })}
    </ul>
  )
}
