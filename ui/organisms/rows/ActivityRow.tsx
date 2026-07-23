// todo: decouple
import type { ReactNode } from 'react'

import { formatEth2 } from '@/lib/blockchain'
import { tsSuperShort } from '@/lib/utils/time'

import { NFT_LOADING_IMAGE } from '@/domain/constants/placeholders'

import type { Activity } from '@/domain/shared/activity'
import type { NFT } from '@/domain/nft'

import { listingStatusToClass } from '@/features/marketplace/lib/listing-status-ui'
import { useCollection } from '@/features/CollectionContext'
import { EntityRow } from './EntityRow'

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
  const { source, type: activityType, isCollectionBid, timestamp, price, status } = activity

  const nft = activity.nft ?? placeholderNFT(activity)

  const badgeClasses = 'absolute -bottom-1 -right-1 text-[10px] px-1 rounded text-black'
  const statusClasses = 'text-[11px] tracking-wide px-1'

  const { collection } = useCollection()

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

  const subtitleExtra = (
    <>
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
    <EntityRow
      nft={nft}
      name={
        source === 'listing' && isCollectionBid
          ? `${collection?.symbol ?? 'unknown'} collection bid`
          : undefined
      }
      tokenIdLabel={isCollectionBid ? '#any' : undefined}
      imageBadge={badge}
      endContent={endContent}
      subtitleExtra={subtitleExtra}
      detailsPane={detailsPane}
    />
  )
}
