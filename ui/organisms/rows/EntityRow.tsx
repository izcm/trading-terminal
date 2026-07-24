import { ReactNode, useState } from 'react'

import type { NFT } from '@/domain/nft'
import { useCollection } from '@/features/CollectionContext'

import { ImageRow } from '@/ui/molecules/ImageRow'
import { DotList } from '@/ui/atoms'

type Props = {
  nft: NFT
  name?: ReactNode
  tokenIdLabel?: ReactNode
  imageBadge?: ReactNode
  endContent?: ReactNode
  subtitleExtra?: ReactNode
  detailsPane?: ReactNode
}

export function EntityRow({
  nft,
  name,
  tokenIdLabel,
  imageBadge,
  endContent,
  subtitleExtra,
  detailsPane,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const { padTokenId, collection } = useCollection()
  const paddedTokenId = padTokenId(nft.tokenId)

  return (
    <div className="flex flex-col gap-1 md:pb-0 pb-1 cursor-pointer">
      <ImageRow
        image={nft.image}
        title={
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="truncate">
              <span className="sm:hidden">#{paddedTokenId}</span>
              <span className="hidden sm:inline">{name ?? nft.name}</span>
            </span>
          </div>
        }
        subtitle={
          <span className="inline-flex items-baseline gap-1">
            <span className="text-xs text-muted md:w-[75px]">
              {collection?.symbol ?? 'unknown'}{' '}
              <span className="hidden sm:inline">{tokenIdLabel ?? `#${paddedTokenId}`}</span>
            </span>
            {subtitleExtra}
          </span>
        }
        imageSize={64}
        imageBadge={imageBadge}
        endContent={endContent}
        classNames="md:min-h-[64px] [&_[data-slot=title]]:text-base md:[&_[data-slot=image]]:!w-[50px] md:[&_[data-slot=image]]:!h-[50px]"
      />

      <div className="md:hidden px-2">
        <DotList
          items={nft.attributes}
          getValue={a => `${a.trait_type}: ${a.value}`}
          className="text-xs font-medium text-subtle"
        />
      </div>

      {detailsPane && (
        <div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="btn py-0 text-xs text-accent/80 underline underline-offset-2"
          >
            {expanded ? 'hide details' : 'view more'}
          </button>

          {expanded && <div className="card mx-1 mt-1">{detailsPane}</div>}
        </div>
      )}
    </div>
  )
}
