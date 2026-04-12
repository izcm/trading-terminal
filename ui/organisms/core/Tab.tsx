import { ReactNode, RefObject } from 'react'

import { Gallery } from './Gallery'
import { NFTPreview } from '@/features/marketplace/ui/NFTPreview'
import { Hex } from '@/domain/shared/eth'

import { BtnProps } from '@/features/tab-config'
import { Spinner } from '@/ui/atoms/Spinner'

type GalleryConfig<T> = {
  // items and selection
  items: T[]
  selected: T | undefined
  onSelect: (item: T) => void

  // render
  item: (item: T) => ReactNode
  itemIsFresh?: (item: T) => boolean

  // ref + pagination
  ref?: RefObject<HTMLUListElement | null>
  onLoadMore?: () => void
  isLoading?: boolean
  hasMore?: boolean
}

type ActionBtnConfig = {
  action: (() => void) | undefined
  props: BtnProps | undefined
  isLoading: boolean
}

type TabProps<T> = {
  gallery: GalleryConfig<T>
  actionBtn: ActionBtnConfig
  details?: (item: T) => ReactNode
}

export function Tab<T extends { id: string; chainId: number; collection: Hex; tokenId: bigint }>({
  gallery,
  actionBtn,
  details,
}: TabProps<T>) {
  const {
    items,
    selected,
    onSelect,
    ref: galleryRef,
    item,
    itemIsFresh,
    onLoadMore,
    isLoading,
    hasMore,
  } = gallery

  const { action, props: actionBtnProps, isLoading: actionIsLoading } = actionBtn

  return (
    <div className="min-h-0 flex-1 flex gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <Gallery<T>
          items={items}
          selected={selected}
          onSelect={onSelect}
          galleryItem={item}
          isFresh={itemIsFresh}
          ref={galleryRef}
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </div>

      <div className="w-1/4 flex flex-col gap-3 mb-2 p-1">
        <div className="pointer-events-none">
          <NFTPreview
            chainId={selected?.chainId}
            address={selected?.collection}
            tokenId={selected?.tokenId}
          />
        </div>
        {actionIsLoading ? (
          <button className="btn btn-ghost pointer-events-none">
            <Spinner />
            <span className="px-1">Checking...</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (!selected) return

              if (action) action()
            }}
            {...actionBtnProps}
          />
        )}

        {selected !== undefined && details !== undefined && (
          <div className="card h-full">{details(selected)}</div>
        )}
      </div>
    </div>
  )
}
