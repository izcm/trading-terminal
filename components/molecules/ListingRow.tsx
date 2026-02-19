'use client'

import { Listing } from '@/domain/types/listing'
import { formatEth2 } from '@/lib/utils/format'

export const ListingRow = ({ listing }: { listing: Listing }) => {
  const isAsk = listing.type === 'ask'
  const collection = listing.collectionData ?? { name: 'unknown', symbol: 'unknown' }

  return (
    <li key={listing.id} className="base-row justify-between gap-4 p-2">
      {/* Type Badge */}
      <div className="w-12 flex justify-center">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${isAsk ? 'text-ask' : 'text-bid'}`}
        >
          {listing.type.toUpperCase()}
        </span>
      </div>

      {/* Token Info */}
      <div className="flex-1 flex flex-col min-w-0">
        <span className="text-sm font-medium truncate">{collection.symbol}</span>
        <span className="text-xs text-muted">Token #{listing.tokenId}</span>
      </div>

      {/* Actor */}
      <div className="flex flex-col items-end text-xs text-muted">
        <span className="text-xs">
          {listing.actor.slice(0, 6)}...{listing.actor.slice(-4)}
        </span>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end">
        <span className="font-semibold">{formatEth2(BigInt(listing.price))} ETH</span>
        <span className="text-xs text-muted">
          {listing.currency.slice(0, 6)}...{listing.currency.slice(-4)}
        </span>
      </div>
    </li>
  )
}
