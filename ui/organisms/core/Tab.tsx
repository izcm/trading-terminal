'use client'

import { ReactNode, useEffect, useState } from 'react'

import { Result } from '@/domain/shared/types/http'

import { ArrowRow } from '@/ui/atoms'
import { ArrowList } from '@/ui/molecules'

export type TabUIProps<T> = {
  secondaryView?: ReactNode
  getGalleryItems: (
    limit: number,
    cursor: string
  ) => Promise<Result<{ items: T[]; nextCursor: string | null }>>
  galleryItem: (item: T) => ReactNode
  sidePanel: (item: T) => ReactNode
}

export function Tab<T extends { id: string }>({
  secondaryView,
  getGalleryItems,
  galleryItem,
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

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-4 overflow-none">
          {secondaryView}
          <ArrowList
            items={items}
            getId={c => c.id}
            selectedId={selected?.id}
            onSelect={setSelected}
            className="overflow-y-auto"
          >
            {({ item, isSelected, onSelect }) => (
              <ArrowRow
                key={item.id}
                isSelected={isSelected}
                onSelect={onSelect}
                className="gap-4 p-2"
              >
                {galleryItem(item)}
              </ArrowRow>
            )}
          </ArrowList>
        </div>

        <div className="basis-1/4 h-full">{selected && sidePanel(selected)}</div>
      </div>
    </div>
  )
}
