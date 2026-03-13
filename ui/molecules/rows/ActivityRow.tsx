// todo: decouple
import { formatEth2 } from '@/lib/blockchain/utils/bigint'
import { NFT_LOADING_IMAGE } from '@/domain/constants/placeholders'

import { tsSuperShort } from '@/domain/shared/utils/time'
import type { Activity } from '@/domain/shared/types/activity'
import { mapTokenUriToNFT, type NFT } from '@/domain/nft'
import { useTokenURI } from '@/lib/blockchain'

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

export function ActivityRow({ item }: { item: Props }) {
  const {
    type: activityType,
    isCollectionBid,
    timestamp,
    collectionSymbol: symbol,
    tokenId,
    price,
  } = item.activity

  const nft = item.nft ?? placeholderNFT(item.activity)
  const rarity = nft.attributes.find(a => a.trait_type === 'rarity')?.value

  return (
    <div className="base-row gap-4 py-1 px-2">
      {/* NFT image */}
      <div className="relative shrink-0 rounded-xl">
        <img src={nft.image} alt={nft.name} className="w-12 h-12 rounded object-cover" />

        {/* activity indicator */}
        <span
          className={`absolute -bottom-1 -right-1 text-[10px] px-1 rounded
          ${activityType === 'ask' ? 'bg-ask text-black' : 'bg-bid text-black'}
        `}
        >
          {activityType}
        </span>
      </div>

      {/* NFT info */}
      <div className="flex flex-col justify-center flex-1 min-h-[56px]">
        <span className="font-semibold truncate">
          {isCollectionBid ? `${symbol} collection bid` : nft.name}
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

// export function ActivityRow({ item }: { item: Props }) {
//   const {
//     activityType,
//     isCollectionBid,
//     timestamp,
//     collectionAddress: address,
//     collectionSymbol: symbol,
//     tokenId,
//     price,
//   } = item.activity
//   const nft = item.nft ?? {}

//   return (
//     <>
//       {/* Type Badge */}
//       <div className="flex items-center justify-center gap-4 ">
//         <span
//           className={`px-2 text-center text-xs font-semibold rounded ${activityType === 'ask' ? 'text-ask/70' : 'text-bid/70'}`}
//         >
//           {activityType.toUpperCase()}
//         </span>
//         <span>{tsSuperShort(timestamp)}</span>
//       </div>
//       <div className="flex-1 flex justify-between">
//         {/* token info */}
//         <div className="flex flex-col">
//           <span className="font-semibold flex items-center gap-1">
//             {symbol}{' '}
//             {isCollectionBid ? (
//               <>
//                 <span
//                   className="inline-flex items-center justify-center w-4 h-4 rounded bg-accent/10 text-accent"
//                   title="Collection bid"
//                 >
//                   <svg viewBox="0 0 16 16" className="w-3 h-3">
//                     <rect
//                       x="1.5"
//                       y="5.5"
//                       width="7"
//                       height="7"
//                       rx="1.5"
//                       stroke="currentColor"
//                       fill="none"
//                       strokeWidth="1.5"
//                     />
//                     <rect
//                       x="6.5"
//                       y="2.5"
//                       width="7"
//                       height="7"
//                       rx="1.5"
//                       stroke="currentColor"
//                       fill="none"
//                       strokeWidth="1.5"
//                     />
//                   </svg>
//                 </span>
//               </>
//             ) : (
//               <>#{tokenId}</>
//             )}
//           </span>
//         </div>

//         {/* price */}
//         <span className="flex font-semibold">{formatEth2(BigInt(price))} ETH</span>
//       </div>
//     </>
//   )
// }
