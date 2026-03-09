'use client'

import { ReactNode, useEffect, useState } from 'react'

import { ArrowRow } from '@/ui/atoms'
import { ArrowList } from '@/ui/molecules'

import { Paginated } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

export type TabUIProps<T> = {
  header: ReactNode
  secondaryView: ReactNode
  browseItem: (item: T) => ReactNode
  sidePanel: (item: T) => ReactNode
}

export function Tab<T extends { id: string }>({
  header,
  secondaryView,
  browseItem,
  sidePanel,
  initialItems,
  initialCursor,
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
    <div className="h-full flex flex-col gap-4">
      {/* ---------- HEADER ---------- */}
      <div className="h-[40px] flex self-end ">{header}</div>

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
                {browseItem(item)}
              </ArrowRow>
            )}
          </ArrowList>
        </div>

        <div className="basis-1/4">{selected && sidePanel(selected)}</div>
      </div>
    </div>
  )
}
