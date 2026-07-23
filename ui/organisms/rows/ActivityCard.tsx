import { useState, type ReactNode } from 'react'
import Image from 'next/image'

import { formatEth2 } from '@/lib/blockchain'
import { tsSuperShort } from '@/lib/utils/time'

import { NFT_LOADING_IMAGE } from '@/domain/constants/placeholders'

import type { Activity } from '@/domain/shared/activity'
import type { NFT } from '@/domain/nft'

import { listingStatusToClass } from '@/features/marketplace/lib/listing-status-ui'
import { useCollection } from '@/features/CollectionContext'
import { Modal } from '@/ui/atoms'

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

export function ActivityCard({ activity, detailsPane }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

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

  const { padTokenId, collection } = useCollection()
  const paddedTokenId = padTokenId(tokenId)

  const badge =
    source === 'trade' ? (
      <span className="text-[10px] px-1 rounded text-black bg-trade/70">trd</span>
    ) : (
      <span
        className={`text-[10px] px-1 rounded text-black ${activityType === 'ask' ? 'bg-ask' : 'bg-bid'}`}
      >
        {activityType}
      </span>
    )

  const title =
    source === 'listing' && isCollectionBid
      ? `${collection?.symbol ?? 'unknown'} collection bid`
      : nft.name

  const summary = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">
          {collection?.symbol ?? 'unknown'} {!isCollectionBid ? `#${paddedTokenId}` : '#any'}
        </span>
        {badge}
      </div>

      {status && status !== 'active' && (
        <span className={`text-[11px] tracking-wide px-1 self-start ${listingStatusToClass[status]}`}>
          {status.toUpperCase()}
        </span>
      )}

      {isCollectionBid && <span className="text-xs text-accent/70">any NFT in collection</span>}

      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{formatEth2(price)} WETH</span>
        <span className="text-xs text-muted">
          {source === 'listing' ? 'exp ' : ''}
          {tsSuperShort(timestamp)}
        </span>
      </div>
    </>
  )

  const viewMoreButton = detailsPane && (
    <button
      onClick={() => setModalOpen(true)}
      className="pt-1 text-xs text-accent/80 underline underline-offset-2 self-start"
    >
      view more
    </button>
  )

  return (
    <div className="card flex gap-3 p-2">
      <Image
        src={nft.image}
        alt={title ?? ''}
        width={80}
        height={80}
        className="rounded object-cover shrink-0 bg-primary"
        loading="eager"
      />

      <div className="flex flex-col justify-between gap-1 flex-1 min-w-0 text-sm">
        <span className="font-medium truncate">{title}</span>
        {summary}
        {viewMoreButton}
      </div>

      {detailsPane && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          {detailsPane}
        </Modal>
      )}
    </div>
  )
}
