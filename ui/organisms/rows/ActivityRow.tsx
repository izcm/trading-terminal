// todo: decouple
import type { ReactNode } from 'react'

import { formatEth2 } from '@/lib/blockchain'
import { useTokenURI } from '@/lib/blockchain/hooks'
import { tsSuperShort } from '@/lib/utils/time'
import { truncateHex } from '@/lib/utils/hex'

import { ExternalLink } from '@/ui/icons'

import { NFT_LOADING_IMAGE } from '@/domain/constants/placeholders'

import type { Activity } from '@/domain/shared/activity'
import { mapTokenUriToNFT, type NFT } from '@/domain/nft'

import { listingStatusToClass } from '@/features/marketplace/lib/listing-status-ui'
import { useCollection } from '@/features/CollectionContext'
import { EntityRow } from './EntityRow'

type Props = {
  activity: Activity
  detailsPane?: ReactNode
  blockExplorerUrl?: string
  isSelected?: boolean
}

function loadingPlaceholderNFT(activity: Activity): NFT {
  return {
    id: `placeholder:${activity.collection}:${activity.tokenId}`,
    chainId: activity.chainId,
    collection: activity.collection,
    tokenId: activity.tokenId,
    name: 'loading...',
    description: '',
    image: NFT_LOADING_IMAGE,
    createdAtBlock: 0n,
    attributes: [],
    createdAt: 0,
  }
}

export function ActivityRow({ activity, detailsPane, blockExplorerUrl, isSelected }: Props) {
  const { source, type: activityType, isCollectionBid, timestamp, price, status, txHash } = activity

  // activity.nft is missing (eg. indexer hasn't backfilled metadata yet) -> read tokenURI directly
  const { data: tokenURI } = useTokenURI(
    activity.nft === undefined
      ? { chainId: activity.chainId, address: activity.collection, tokenId: activity.tokenId }
      : undefined
  )

  const nft =
    activity.nft ??
    (tokenURI
      ? mapTokenUriToNFT(activity.chainId, activity.collection, activity.tokenId, tokenURI)
      : loadingPlaceholderNFT(activity))

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
      {blockExplorerUrl && txHash && (
        <a
          href={`${blockExplorerUrl}/tx/${txHash}`}
          tabIndex={isSelected ? 0 : -1}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-0.5 text-xs text-accent/70 hover:text-accent"
        >
          etherscan
          <ExternalLink size={10} />
          <span className="hidden md:inline">{truncateHex(txHash)}</span>
        </a>
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
