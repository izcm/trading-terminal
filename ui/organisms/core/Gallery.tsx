import { ReactNode, useEffect, useState } from 'react'

import { ArrowRow, TextInput } from '@/ui/atoms'
import { ArrowList } from '@/ui/molecules'

export type TabUIProps<T> = {
  items: T[]
  galleryItem: (item: T) => ReactNode
  selected?: T
  onSelect: (item: T) => void
  galleryView?: 'list' | 'card'
}

export function Gallery<T extends { id: string }>({
  items,
  galleryItem,
  selected,
  onSelect,
  galleryView = 'list',
}: TabUIProps<T>) {
  const galleryClasses =
    galleryView === 'list'
      ? {
          arrowList: 'flex flex-col gap-4 p-1',
          arrowRow: 'border border-soft rounded-xl transition',
        }
      : {
          arrowList:
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg-rounded',
          arrowRow: 'outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-lg block',
        }

  return (
    <div className="flex h-full min-h-0 gap-4">
      {/* LEFT COLUMN */}
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <ArrowList
          items={items}
          getId={c => c.id}
          selectedId={selected?.id}
          onSelect={onSelect}
          className={`${galleryClasses.arrowList} min-h-0 flex-1 px-2`}
        >
          {({ item, isSelected, onSelect }) => (
            <ArrowRow
              key={item.id}
              isSelected={isSelected}
              onSelect={onSelect}
              className={`${galleryClasses.arrowRow}`}
            >
              {galleryItem(item)}
            </ArrowRow>
          )}
        </ArrowList>
      </div>
    </div>
  )
}
