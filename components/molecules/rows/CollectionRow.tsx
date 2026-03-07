'use client'

import Link from 'next/link'

import type { NFTCollection } from '@/domain'
type Props = {
  collection: NFTCollection
}

export function CollectionRow({ collection }: Props) {
  return (
    <li>
      <Link
        href={`/collections/${collection.address}`}
        className="interactive-row filter-row overflow-y-auto no-scrollbar"
      >
        <img
          src={collection.imageUrl || '/placeholder-collection.png'}
          className="w-full h-full object-cover"
          alt="collection image"
        />

        <div className="min-w-0">
          <span>{collection.name}</span>
          <div className="text-xs">
            {collection.address.slice(0, 10)}...{collection.address.slice(-6)}
          </div>
        </div>

        <div className="text-xs text-muted">
          <div className="font-semibold">{collection.symbol || 'N/A'}</div>
        </div>

        <div className="text-xs text-muted">
          <div className="font-semibold">{collection.totalSupply || 'N/A'}</div>
          <div className="text-xs">items</div>
        </div>
      </Link>
    </li>
  )
}
