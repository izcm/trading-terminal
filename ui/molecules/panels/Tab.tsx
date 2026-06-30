import { ReactNode } from 'react'

import { Gallery, GalleryProps } from './Gallery'
import { NFTPreview } from '@/features/marketplace/ui/NFTPreview'
import { Hex } from '@/domain/shared/eth'

import { BtnProps } from '@/features/tab-config'
import { Spinner } from '@/ui/atoms/Spinner'

type ActionBtnConfig = {
  action: (() => void) | undefined
  props: BtnProps | undefined
  isLoading: boolean
}

type TabProps<T> = {
  gallery: GalleryProps<T>
  actionBtn: ActionBtnConfig
  details?: (item: T) => ReactNode
}

export function Tab<T extends { id: string; chainId: number; collection: Hex; tokenId: bigint }>({
  gallery,
  actionBtn,
  details,
}: TabProps<T>) {
  const { selected } = gallery
  const { action, props: actionBtnProps, isLoading: actionIsLoading } = actionBtn

  return (
    <div className="min-h-0 flex-1 flex gap-4">
      <div className="flex-1 flex flex-col">
        <Gallery<T> {...gallery} />
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
            className={actionBtnProps?.className ?? 'btn invisible'}
          />
        )}

        {selected !== undefined && details !== undefined && (
          <div className="card h-full">{details(selected)}</div>
        )}
      </div>
    </div>
  )
}
