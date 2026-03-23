import { ReactNode } from 'react'

import { ArrowRow } from '@/ui/atoms'
import { ArrowList } from '@/ui/molecules'
import clsx from 'clsx'

export type GalleryProps<T> = {
  items: T[]
  galleryItem: (item: T) => ReactNode
  selected?: T
  onSelect: (item: T) => void
  isFresh?: (item: T) => boolean
  galleryView?: 'list' | 'card'
}

export function Gallery<T extends { id: string }>({
  items,
  galleryItem,
  selected,
  onSelect,
  isFresh = () => false,
  galleryView = 'list',
}: GalleryProps<T>) {
  const galleryClasses =
    galleryView === 'list'
      ? {
          arrowList: 'flex flex-col gap-4',
          arrowRow: 'border border-default/65 rounded-xl transition',
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
          className={`${galleryClasses.arrowList} min-h-0 flex-1 p-1`}
        >
          {({ item, isSelected, onSelect }) => (
            <ArrowRow
              key={item.id}
              isSelected={isSelected}
              onSelect={onSelect}
              className={clsx(
                galleryClasses.arrowRow,

                // default
                !isSelected && !isFresh(item) && 'hover:bg-white/15 bg-secondary/80',

                // fresh
                !isSelected && isFresh(item) && 'fresh',

                // selected
                isSelected && 'bg-accent/30'
              )}
            >
              {galleryItem(item)}
            </ArrowRow>
          )}
        </ArrowList>
      </div>
    </div>
  )
}
