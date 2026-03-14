// todo: decouple
import { formatEth2 } from '@/lib/blockchain/utils/bigint'
import { useTokenURI } from '@/lib/blockchain'

import { NFT_LOADING_IMAGE } from '@/domain/constants/placeholders'

import { tsSuperShort } from '@/domain/shared/utils/time'
import type { Activity } from '@/domain/shared/activity'
import { mapTokenUriToNFT, type NFT } from '@/domain/nft'

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
    attributes: [],
  }
}

export function ActivityItem({ activity }: { activity: Activity }) {
  const { chainId, collection, tokenId } = activity

  const { data: tokenURI } = useTokenURI({
    chainId,
    address: collection,
    tokenId: BigInt(tokenId),
  })

  const nft = tokenURI ? mapTokenUriToNFT(chainId, collection, tokenId, tokenURI) : undefined

  return <ActivityRow item={{ activity, nft }} />
}

function ActivityRow({ item }: { item: Props }) {
  const {
    source,
    type: activityType,
    isCollectionBid,
    timestamp,
    collectionSymbol: symbol,
    tokenId,
    price,
  } = item.activity

  const nft = item.nft ?? placeholderNFT(item.activity)
  const rarity = nft.attributes.find(a => a.trait_type === 'rarity')?.value

  const badgeClasses = 'absolute -bottom-1 -right-1 text-[10px] px-1 rounded text-black'

  return (
    <div className="base-row gap-4 py-1 px-2">
      {/* NFT image */}
      <div className="relative shrink-0 rounded-xl">
        <img src={nft.image} alt={nft.name} className="w-12 h-12 rounded object-cover" />

        {/* activity indicator */}
        {source === 'sale' ? (
          <span className={`${badgeClasses} bg-stat/70`}>sale</span>
        ) : (
          <span
            className={`${badgeClasses} ${activityType === 'ask' ? 'bg-ask text-black' : 'bg-bid text-black'}
        `}
          >
            {activityType}
          </span>
        )}
      </div>

      {/* NFT info */}
      <div className="flex flex-col justify-center flex-1 min-h-[56px]">
        <span className="font-semibold truncate">
          {source === 'listing' && isCollectionBid ? `${symbol} collection bid` : nft.name}
        </span>

        <span className="text-xs text-text-muted">
          {symbol} {!isCollectionBid && `#${tokenId}`}
        </span>

        {!isCollectionBid && rarity && <span className="text-[11px] text-accent">{rarity}</span>}

        {isCollectionBid && <span className="text-xs text-accent/70">any NFT in collection</span>}
      </div>

      {/* price */}
      <div className="text-right flex flex-col px-1">
        <span className="font-semibold">{formatEth2(price)} ETH</span>

        <span className="text-xs text-text-muted">{tsSuperShort(timestamp)}</span>
      </div>
    </div>
  )
}
