import { Fragment, ReactNode } from 'react'

type Props<T> = {
  items: T[]
  getValue: (item: T) => ReactNode
  className?: string
}

export function DotList<T>({ items, getValue, className }: Props<T>) {
  return (
    <span className={className}>
      {items.map((item, i) => (
        <Fragment key={i}>
          {getValue(item)}
          {i < items.length - 1 && <span className="text-muted mx-1">·</span>}
        </Fragment>
      ))}
    </span>
  )
}
