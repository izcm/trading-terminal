// todo: decouple
import { useState, type ReactNode } from 'react'

import { formatEth2 } from '@/lib/blockchain'
// import { useTokenURI } from '@/lib/blockchain/hooks'
import { tsSuperShort } from '@/lib/utils/time'

import { NFT_LOADING_IMAGE } from '@/domain/constants/placeholders'

import type { Activity } from '@/domain/shared/activity'
// import { mapTokenUriToNFT } from '@/domain/nft'
import type { NFT } from '@/domain/nft'

import { listingStatusToClass } from '@/features/marketplace/lib/listing-status-ui'
import { useCollection } from '@/features/CollectionContext'
import { ImageRow } from '@/ui/molecules/ImageRow'
import { NFTAttributes } from './NFTAttributes'

type Props = {
  activity: Activity
  detailsPane?: ReactNode
}

function placeholderNFT(activity: Activity): NFT {
  return {
    id: `placeholder:${activity.collection}:${activity.tokenId}`,
    chainId: 0,
    collection: activity.collection,
    tokenId: BigInt(activity.tokenId),
    name: "couldn't read NFT",
    description: '',
    image: NFT_LOADING_IMAGE,
    createdAtBlock: 0n,
    attributes: [],
    createdAt: 0,
  }
}

export function ActivityRow({ activity, detailsPane }: Props) {
  const [expanded, setExpanded] = useState(false)

  const {
    source,
    type: activityType,
    isCollectionBid,
    timestamp,
    tokenId,
    price,
    status,
  } = activity

  const nft = activity.nft ?? placeholderNFT(activity)

  const badgeClasses = 'absolute -bottom-1 -right-1 text-[10px] px-1 rounded text-black'
  const statusClasses = 'text-[11px] tracking-wide px-1'

  const { padTokenId, collection } = useCollection()
  const paddedTokenId = padTokenId(tokenId)

  const badge =
    source === 'trade' ? (
      <span className={`${badgeClasses} bg-trade/70`}>trd</span>
    ) : (
      <span
        className={`${badgeClasses} ${activityType === 'ask' ? 'bg-ask text-black' : 'bg-bid text-black'}`}
      >
        {activityType}
      </span>
    )

  const subtitle = (
    <>
      <span className="text-xs text-muted w-[75px]">
        {collection?.symbol ?? 'unknown'} {!isCollectionBid ? `#${paddedTokenId}` : '#any'}
      </span>
      {status && status !== 'active' && (
        <span className={`${statusClasses} ${listingStatusToClass[status]}`}>
          {status.toUpperCase()}
        </span>
      )}
      {isCollectionBid && (
        <span className="text-xs text-accent/70 block">any NFT in collection</span>
      )}
    </>
  )

  const endContent = (
    <div className="flex flex-col px-1 text-right">
      <span className="font-semibold text-base">{formatEth2(price)} WETH</span>
      <span className="text-xs text-muted">
        {source === 'listing' ? 'exp ' : ''}
        {tsSuperShort(timestamp)}
      </span>
    </div>
  )

  return (
    <div className="flex flex-col gap-1">
      <ImageRow
        image={nft.image}
        title={
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="truncate">
              <span className="sm:hidden">#{paddedTokenId}</span>
              <span className="hidden sm:inline">
                {source === 'listing' && isCollectionBid
                  ? `${collection?.symbol ?? 'unknown'} collection bid`
                  : nft.name}
              </span>
            </span>
          </div>
        }
        subtitle={<span className="inline-flex items-center gap-1">{subtitle}</span>}
        imageSize={75}
        imageBadge={badge}
        endContent={endContent}
        className="md:min-h-[64px] [&_[data-slot=title]]:text-base md:[&_[data-slot=image]]:!w-[50px] md:[&_[data-slot=image]]:!h-[50px]"
      />

      <NFTAttributes attributes={nft.attributes} />

      {detailsPane && (
        <div className="px-2 pb-2">
          <button
            onClick={() => setExpanded(v => !v)}
            className="btn py-0 text-xs text-accent/80 underline underline-offset-2"
          >
            {expanded ? 'hide details' : 'view more'}
          </button>

          {expanded && <div className="mt-2 card p-2">{detailsPane}</div>}
        </div>
      )}
    </div>
  )
}
