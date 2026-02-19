'use client'

import { Listing } from '@/domain/types/listing'
import { formatEth2 } from '@/lib/utils/format'

interface ListingListProps {
  listings: Listing[]
}

export const ListingList = ({ listings }: ListingListProps) => {
  return (
    <ul className="overflow-y-auto no-scrollbar w-full">
      {listings.map((listing, i) => {
        const isAsk = listing.type === 'ask'

        return (
          <li key={listing.orderHash} className="base-row justify-between gap-4 p-2">
            {/* Type Badge */}
            <div className="w-12 flex justify-center">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  isAsk ? 'text-ask' : 'text-bid'
                }`}
              >
                {listing.type.toUpperCase()}
              </span>
            </div>

            {/* Token Info */}
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {listing.collection.slice(0, 6)}...{listing.collection.slice(-4)}
              </span>
              <span className="text-xs text-muted">Token #{listing.tokenId}</span>
            </div>

            {/* Price */}
            <div className="flex flex-col items-end">
              <span className="font-semibold">{formatEth2(BigInt(listing.price))} ETH</span>
              <span className="text-xs text-muted">
                {listing.currency.slice(0, 6)}...{listing.currency.slice(-4)}
              </span>
            </div>

            {/* Actor */}
            <div className="flex flex-col items-end text-xs text-muted">
              <span className="text-xs">
                {listing.actor.slice(0, 6)}...{listing.actor.slice(-4)}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
