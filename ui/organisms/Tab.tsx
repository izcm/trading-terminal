import { ReactNode } from 'react'
import { TextInput } from '../atoms'
import { Gallery } from './core/Gallery'
import { NFTPreview } from '@/features/browse/ui/NFTPreview'
import { Hex } from '@/domain/shared/eth'

type TabProps<T> = {
  items: T[]
  selected: T | undefined
  onSelect: (item: T) => void
  galleryItem: (item: T) => ReactNode
  mainActionBtn: (item: T) => ReactNode
  details?: (item: T) => ReactNode
}

export function Tab<T extends { id: string; chainId: number; collection: Hex; tokenId: bigint }>({
  items,
  selected,
  onSelect,
  galleryItem,
  mainActionBtn,
  details,
}: TabProps<T>) {
  return (
    <div className="min-h-0 flex gap-4 justify-center">
      <div className="flex-1 flex flex-col gap-4">
        <TextInput />

        <Gallery<T>
          items={items}
          selected={selected}
          onSelect={onSelect}
          galleryItem={galleryItem}
        />
      </div>

      <div className="basis-1/4 flex flex-col gap-3 mb-2">
        <div className="pointer-events-none">
          <NFTPreview
            chainId={selected?.chainId}
            address={selected?.collection}
            tokenId={selected?.tokenId}
          />
        </div>
        {selected ? (
          mainActionBtn(selected)
        ) : (
          <button className="btn btn-secondary">view full receipt</button>
        )}
        <div className="card bg-secondary h-full">{details && details(selected as any)}</div>
      </div>
    </div>
  )
}
