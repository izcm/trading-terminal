'use client'

import type { Listing } from '@/lib/dmrkt-indexer/types/listing'
import { DetailFields, type DetailField } from '@/ui/molecules/DetailFields'

import { shortAddr } from '@/domain/shared/utils/fmt/hex'
import { formatTsUTC } from '@/domain/shared/utils/time'

type Props = {
  listing: Listing | null
}

const DETAIL_FIELDS: DetailField<Listing>[] = [
  {
    label: 'token id',
    getValue: l => (l.isCollectionBid ? 'any' : `#${l.tokenId}`),
    className: 'font-mono',
  },
  {
    label: 'price',
    getValue: l => `${Number(l.price) / 1e18} ETH`,
    className: 'font-semibold',
  },
  {
    label: 'seller',
    getValue: l => shortAddr(l.actor),
    className: 'font-mono',
  },
]

const TIMING_FIELDS: DetailField<Listing>[] = [
  { label: 'starts', getValue: l => formatTsUTC(l.start) },
  { label: 'expires', getValue: l => formatTsUTC(l.end) },
]

export function ListingDetails({ listing }: Props) {
  if (!listing) {
    return <div className="card h-full p-4 text-sm">select a listing ✨</div>
  }

  const collection = listing.nftCollection?.name ?? 'unknown collection'

  return (
    <div className="flex flex-col card h-full gap-6 p-4 text-sm" tabIndex={-1}>
      {/* title */}
      <div className="flex justify-between text-start">
        <div className="flex flex-col">
          <span className="text-xs">collection</span>
          <span className="font-medium">{collection}</span>
        </div>

        <span
          className={`text-xs font-semibold px-2 py-1 rounded
          ${listing.type === 'ask' ? 'bg-ask/10 text-ask' : 'bg-bid/10 text-bid'}`}
        >
          {listing.type.toUpperCase()}
        </span>
      </div>

      {/* details */}
      <DetailFields data={listing} fields={DETAIL_FIELDS} />

      {/* timing */}
      <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
        <DetailFields data={listing} fields={TIMING_FIELDS} />
      </div>
    </div>
  )
}
