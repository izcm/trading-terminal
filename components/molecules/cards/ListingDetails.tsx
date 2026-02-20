// molecules/ListingDetails.tsx

'use client'

import { Listing } from '@/domain/types/listing'
import { shortAddr } from '@/lib/utils/format'

type Props = {
  listing: Listing | null
}

const formatTime = (unix: number) => {
  const d = new Date(unix)
  return d.toLocaleString()
}

export function ListingDetails({ listing }: Props) {
  // nothing selected yet
  if (!listing) {
    return <div className="card h-full p-4 text-sm">select a listing ✨</div>
  }

  const collection = listing.collectionData?.name ?? 'unknown collection'

  return (
    <div
      className="flex flex-col card h-full gap-6 p-4 text-sm"
      tabIndex={-1} // important later for keyboard focus
    >
      {/* title */}
      <div className="flex justify-between">
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

      {/* token */}
      <div className="flex justify-between">
        <span className="text-zinc-500">token id</span>
        <span className="font-mono">#{listing.tokenId}</span>
      </div>

      {/* price */}
      <div className="flex justify-between text-base">
        <span className="text-zinc-500">price</span>
        <span className="font-semibold">
          {Number(listing.price) / 1e18} {listing.currency}
        </span>
      </div>

      {/* seller */}
      <div className="flex justify-between">
        <span className="text-zinc-500">seller</span>
        <span className="font-mono">{shortAddr(listing.actor)}</span>
      </div>

      {/* timing */}
      <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
        <div className="flex justify-between">
          <span className="text-zinc-500">starts</span>
          <span>{formatTime(listing.start)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">expires</span>
          <span>{formatTime(listing.end)}</span>
        </div>
      </div>
    </div>
  )
}
