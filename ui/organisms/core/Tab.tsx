import { ReactNode, RefObject } from 'react'

import { Gallery } from './Gallery'
import { NFTPreview } from '@/features/marketplace/ui/NFTPreview'
import { Hex } from '@/domain/shared/eth'

type TabProps<T> = {
  items: T[]
  selected: T | undefined
  onSelect: (item: T) => void
  galleryRef?: RefObject<HTMLUListElement | null>
  galleryItem: (item: T) => ReactNode
  galleryItemIsFresh?: (item: T) => boolean
  mainActionBtn: (item: T) => ReactNode
  action: (() => void) | undefined
  details?: (item: T) => ReactNode
}

export function Tab<T extends { id: string; chainId: number; collection: Hex; tokenId: bigint }>({
  items,
  selected,
  onSelect,
  galleryRef,
  galleryItem,
  galleryItemIsFresh,
  mainActionBtn,
  action,
  details,
}: TabProps<T>) {
  console.log(details)
  return (
    <div className="min-h-0 flex-1 flex gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <Gallery<T>
          items={items}
          selected={selected}
          onSelect={onSelect}
          galleryItem={galleryItem}
          isFresh={galleryItemIsFresh}
          ref={galleryRef}
        />
      </div>

      <div className="max-w-1/4 flex flex-col gap-3 mb-2 p-1">
        <div className="pointer-events-none">
          <NFTPreview
            chainId={selected?.chainId}
            address={selected?.collection}
            tokenId={selected?.tokenId}
          />
        </div>
        <button
          onClick={() => {
            if (!selected) return

            if (action) action()
          }}
        >
          hi
        </button>
        {selected && mainActionBtn(selected)}
        {selected !== undefined && details !== undefined && (
          <div className="card bg-secondary h-full">{details(selected)}</div>
        )}
      </div>
    </div>
  )
}
