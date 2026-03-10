// todo: decouple this
import { formatEth2 } from '@/lib/blockchain/utils/bigint'
import type { Listing } from '@/lib/dmrkt-indexer/types/listing'

import { addrShort } from '@/domain/shared/utils/fmt/hex'
import { tsSuperShort } from '@/domain/shared/utils/time'

export function ListingRow({ listing }: { listing: Listing }) {
  const isAsk = listing.type === 'ask'
  const isCb = !isAsk && listing.isCollectionBid

  const collection = listing.nftCollection ?? { name: 'unknown', symbol: 'unknown' }

  // each row should have icon (if not tokenuri)
  // ◼ DSEAL #36
  // ◉ DNODE #5
  // ◆ DGREM #81
  return (
    <>
      {/* Type Badge */}
      <div className="flex items-center justify-center gap-4 ">
        <span
          className={`px-3 text-center text-xs font-semibold rounded ${isAsk ? 'text-ask/70' : 'text-bid/70'}`}
        >
          {listing.type.toUpperCase()}
        </span>
        <span>{tsSuperShort(listing.start)}</span>
      </div>
      <div className="flex-1 flex justify-between">
        {/* token info */}
        <div className="flex flex-col">
          <span className="font-semibold flex items-center gap-1">
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
        </div>

        {/* price */}
        <span className="flex font-semibold">{formatEth2(BigInt(listing.price))} ETH</span>
      </div>
    </>
  )
}
