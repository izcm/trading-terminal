'use client'

import { Listing } from '@/domain/types/listing'
import { formatEth2 } from '@/lib/utils/format'

export function ListingRow({
  listing,
  onSelect,
  selected,
}: {
  listing: Listing
  onSelect: (l: Listing) => void
  selected?: boolean
}) {
  const isAsk = listing.type === 'ask'
  const isCb = !isAsk && listing.isCollectionBid

  const collection = listing.collectionMeta ?? { name: 'unknown', symbol: 'unknown' }

  return (
    <li>
      <button
        onClick={() => onSelect(listing)}
        className={`w-full base-row gap-4 p-2 rounded-md transition
          ${selected ? 'bg-white/5' : 'hover:bg-white/5'}
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent
        `}
        aria-selected={selected}
      >
        {/* side indicator */}
        {/* Type Badge */}
        <div className="w-12 flex justify-center">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${isAsk ? 'text-ask/70' : 'text-bid/70'}`}
          >
            {listing.type.toUpperCase()}
          </span>
        </div>

        {/* token info */}
        <div className="flex-1 flex flex-col min-w-0">
          <span className="text-sm font-semibold truncate flex items-center gap-1">
            {collection.symbol}{' '}
            {isCb ? (
              <>
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded bg-accent/10 text-accent"
                  title="Collection bid"
                >
                  <svg viewBox="0 0 16 16" className="w-3 h-3">
                    <rect
                      x="1.5"
                      y="5.5"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="6.5"
                      y="2.5"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </>
            ) : (
              <>#{listing.tokenId}</>
            )}
          </span>

          <span className="text-xs text-muted">
            {listing.actor.slice(0, 6)}...{listing.actor.slice(-4)}
          </span>
        </div>

        {/* price */}
        <div className="flex flex-col items-end leading-tight">
          <span className="font-semibold">{formatEth2(BigInt(listing.price))} ETH</span>
          <span className="text-xs text-muted">
            {listing.currency.slice(0, 6)}...{listing.currency.slice(-4)}
          </span>
        </div>
      </button>
    </li>
  )
}
