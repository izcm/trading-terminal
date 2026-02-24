'use client'

import type { ListingDTO } from '@/lib/dmrkt-indexer/types/listing'
import { formatTsUTC, shortAddr } from '@/lib/utils/format'

type Props = {
  listing: ListingDTO | null
}

type DetailField = {
  label: string
  getValue: (listing: ListingDTO) => string
  className?: string
}

const DETAIL_FIELDS: DetailField[] = [
  {
    label: 'token id',
    getValue: listing => (listing.isCollectionBid ? 'any' : `#${listing.tokenId}`),
    className: 'font-mono',
  },
  {
    label: 'price',
    getValue: listing => `${Number(listing.price) / 1e18} ETH`,
    className: 'font-semibold',
  },
  {
    label: 'seller',
    getValue: listing => shortAddr(listing.actor),
    className: 'font-mono',
  },
]

const TIMING_FIELDS: DetailField[] = [
  {
    label: 'starts',
    getValue: listing => formatTsUTC(listing.start),
  },
  {
    label: 'expires',
    getValue: listing => formatTsUTC(listing.end),
  },
]

function DetailRow({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500">{label}</span>
      <span className={className}>{value}</span>
    </div>
  )
}

export function ListingDetails({ listing }: Props) {
  // nothing selected yet
  if (!listing) {
    return <div className="card h-full p-4 text-sm">select a listing ✨</div>
  }

  const collection = listing.collectionMeta?.name ?? 'unknown collection'

  return (
    <div
      className="flex flex-col card h-full gap-6 p-4 text-sm"
      tabIndex={-1} // important later for keyboard focus
    >
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
      {DETAIL_FIELDS.map(field => (
        <DetailRow
          key={field.label}
          label={field.label}
          value={field.getValue(listing)}
          className={field.className}
        />
      ))}

      {/* timing */}
      <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
        {TIMING_FIELDS.map(field => (
          <DetailRow
            key={field.label}
            label={field.label}
            value={field.getValue(listing)}
            className={field.className}
          />
        ))}
      </div>
    </div>
  )
}
