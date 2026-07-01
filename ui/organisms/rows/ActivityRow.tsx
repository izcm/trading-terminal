// todo: decouple
import { formatEth2 } from '@/lib/blockchain/utils/bigint'
import { useTokenURI } from '@/lib/blockchain'
import { tsSuperShort } from '@/lib/utils/time'

import { NFT_LOADING_IMAGE } from '@/domain/constants/placeholders'

import type { Activity } from '@/domain/shared/activity'
import { mapTokenUriToNFT, type NFT } from '@/domain/nft'

import { listingStatusToClass } from '@/features/marketplace/lib/listing-status-ui'
import { useCollection } from '@/features/CollectionContext'
import { ImageRow } from '@/ui/molecules/ImageRow'

type Props = {
  activity: Activity
  nft?: NFT
}

function placeholderNFT(activity: Activity): NFT {
  return {
    id: `placeholder:${activity.collection}:${activity.tokenId}`,
    chainId: 0,
    collection: activity.collection,
    tokenId: BigInt(activity.tokenId),
    name: 'Loading...',
    description: '',
    image: NFT_LOADING_IMAGE,
    createdAtBlock: 0n,
    attributes: [],
    createdAt: 0,
  }
}

export function ActivityItem({ activity }: { activity: Activity }) {
  const { chainId, collection: colAddr, tokenId } = activity

  const { data: tokenURI } = useTokenURI({
    chainId,
    address: colAddr,
    tokenId: BigInt(tokenId),
  })

  const nft = tokenURI ? mapTokenUriToNFT(chainId, colAddr, tokenId, tokenURI) : undefined

  return <ActivityRow item={{ activity, nft }} />
}

function ActivityRow({ item }: { item: Props }) {
  const {
    source,
    type: activityType,
    isCollectionBid,
    timestamp,
    tokenId,
    price,
    status,
  } = item.activity

  const nft = item.nft ?? placeholderNFT(item.activity)

  const badgeClasses = 'absolute -bottom-1 -right-1 text-[10px] px-1 rounded text-black'

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
      <span className="text-xs text-muted inline-block w-[75px]">
        {collection?.symbol ?? 'unknown'} {!isCollectionBid ? `#${paddedTokenId}` : '#any'}
      </span>
      {status && status !== 'active' && (
        <span className={`text-[11px] tracking-wide px-1 ${listingStatusToClass[status]}`}>
          {status.toUpperCase()}
        </span>
      )}
      {isCollectionBid && (
        <span className="text-xs text-accent/70 block">any NFT in collection</span>
      )}
    </>
  )

  const endContent = (
    <div className="flex flex-col px-1 flex-1 text-right ">
      <span className="font-semibold">{formatEth2(price)} ETH</span>
      <span className="text-xs text-muted">
        {source === 'listing' ? 'exp ' : ''}
        {tsSuperShort(timestamp)}
      </span>
    </div>
  )

  return (
    <ImageRow
      image={nft.image}
      title={
        source === 'listing' && isCollectionBid
          ? `${collection?.symbol ?? 'unknown'} collection bid`
          : nft.name
      }
      subtitle={subtitle}
      imageBadge={badge}
      endContent={endContent}
      classNames={{ root: 'min-h-[64px] [&>*:nth-child(2)]:gap-1', title: 'text-md' }}
    />
  )
}
