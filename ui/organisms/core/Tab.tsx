import { ReactNode, useEffect, useState } from 'react'

import { Result } from '@/lib/utils/http'

import { ArrowRow } from '@/ui/atoms'
import { ArrowList } from '@/ui/molecules'

export type TabUIProps<T> = {
  secondaryView?: (items: T[]) => ReactNode
  getGalleryItems: (
    limit: number,
    cursor: string
  ) => Promise<Result<{ items: T[]; nextCursor: string | null }>>
  galleryItem: (item: T) => ReactNode
  galleryView?: 'list' | 'card'
  sidePanel: (item: T) => ReactNode
}

export function Tab<T extends { id: string }>({
  secondaryView,
  getGalleryItems,
  galleryItem,
  galleryView = 'list',
  sidePanel,
  initialItems,
  initialCursor,
}: TabUIProps<T> & { initialItems: T[]; initialCursor: string | null }) {
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor)

  const [items, setItems] = useState<T[]>(initialItems)
  const [selected, setSelected] = useState<T | null>(initialItems.length ? initialItems[0] : null)

  // todo: make this on scroll
  useEffect(() => {
    if (!nextCursor) return

    const fetchMore = async () => {
      const res = await getGalleryItems(10, nextCursor)

      if (res.ok) {
        const { nextCursor, items: newItems } = res.data

        setNextCursor(nextCursor)
        setItems(prev => [...prev, ...newItems])
      }
    }

    fetchMore()
  }, [nextCursor])

  const galleryClasses =
    galleryView === 'list'
      ? {
          arrowList: 'flex flex-col gap-4',
          arrowRow:
            'base-row border border-soft rounded-xl transition gap-4 px-3 py-3 bg-secondary/50',
        }
      : {
          arrowList:
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg-rounded',
          arrowRow: 'outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg block',
        }

  return (
    <div className="flex gap-4 overflow-hidden p-1">
      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col gap-4">
        {secondaryView && secondaryView(items)}
        <ArrowList
          items={items}
          getId={c => c.id}
          selectedId={selected?.id}
          onSelect={setSelected}
          className={`${galleryClasses.arrowList} p-1`}
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

      <div className="w-1/4 shrink-0 h-full flex flex-col gap-4">
        {selected && sidePanel && sidePanel(selected)}
      </div>
    </div>
  )
}
