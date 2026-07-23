import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Tab navigation menu
 */
type TabsProps<T extends string> = {
  value: T
  onSelect: (v: T) => void
  items: readonly T[]
  renderItem?: (item: T) => ReactNode
  className?: string
}

type TabBtnProps<T extends string> = {
  item: T
  active: boolean
  onSelect: (v: T) => void
  className?: string
  children?: ReactNode
}

export function TabBtn<T extends string>({
  item,
  active,
  onSelect,
  className,
  children,
}: TabBtnProps<T>) {
  return (
    <button
      onClick={() => onSelect(item)}
      className={cn(
        'flex-1 py-2 flex items-center justify-center gap-1 border-b-2 transition-colors duration-200 cursor-pointer',
        active
          ? 'border-accent/60 text-accent-weak'
          : 'border-transparent text-subtle hover:border-accent/30',
        className
      )}
    >
      {children ?? item}
    </button>
  )
}

export function Tabs<T extends string>({
  value,
  onSelect,
  items,
  renderItem,
  className,
}: TabsProps<T>) {
  return (
    <>
      {items.map(item => (
        <TabBtn
          key={item}
          item={item}
          active={item === value}
          onSelect={onSelect}
          className={className}
        >
          {renderItem?.(item)}
        </TabBtn>
      ))}
    </>
  )
}
