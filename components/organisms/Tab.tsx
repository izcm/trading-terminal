'use client'

import { ReactNode, useEffect, useState } from 'react'

import { ArrowList, ArrowRow } from '@/components/atoms'
import { Paginated } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

export type TabUIProps<T> = {
  header: ReactNode
  browseItem: (item: T) => ReactNode
  sidebar: (item: T) => ReactNode
}

export function Tab<T extends { id: string }>({
  header,
  browseItem,
  sidebar,
  items: initialItems,
  nextCursor: initialCursor,
}: TabUIProps<T> & Paginated<T>) {
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor)

  const [items, setItems] = useState<T[]>(initialItems)
  const [selected, setSelected] = useState<T | null>(initialItems.length ? initialItems[0] : null)

  // todo: make this on scroll
  // useEffect(() => {
  //   // if (!nextCursor) return

  //   const fetchMore = async () => {
  //     const res = await getDmrktItems<T>(nextCursor)

  //     if (res.ok) {
  //       const { nextCursor, items: newItems } = res.data

  //       // setNextCursor(nextCursor)
  //       setItems(prev => [...prev, ...newItems])
  //     }
  //   }

  //   fetchMore()
  // }, [nextCursor])

  return (
    <div className="h-full w-full flex flex-col gap-4">
      {/* ---------- HEADER ---------- */}
      <div className="h-[40px] flex self-end">{header}</div>

      <div className="h-full flex gap-4 overflow-hidden">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          <ArrowList
            items={items}
            getId={c => c.id}
            selectedId={selected?.id}
            onSelect={setSelected}
            className="w-full"
          >
            {({ item, isSelected, onSelect }) => (
              <ArrowRow
                key={item.id}
                isSelected={isSelected}
                onSelect={onSelect}
                className="gap-4 p-2"
              >
                {browseItem(item)}
              </ArrowRow>
            )}
          </ArrowList>
        </div>

        <div className="basis-1/4">{selected && sidebar(selected)}</div>
      </div>
    </div>
  )
}
