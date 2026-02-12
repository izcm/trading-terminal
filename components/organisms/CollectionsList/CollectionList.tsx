'use client'

import Link from 'next/link'

import { NFTCollection } from '@/domain/types'

interface CollectionListProps {
  collections: NFTCollection[]
}

export const CollectionList = ({ collections }: CollectionListProps) => {
  return (
    <ul className="overflow-y-auto no-scrollbar">
      {collections.map((col, i) => {
        return (
          <li key={i}>
            <Link
              href={`/collections/${col.address}`}
              className="interactive-row filter-row overflow-y-auto no-scrollbar"
            >
              <img
                src={col.imageUrl || '/placeholder-collection.png'}
                className="w-full h-full object-cover"
                alt="collection image"
              />

              <div className="min-w-0">
                <span>{col.name}</span>
                <div className="text-xs">
                  {col.address.slice(0, 10)}...{col.address.slice(-6)}
                </div>
              </div>

              <div className="text-xs text-muted">
                <div className="font-semibold">{col.symbol || 'N/A'}</div>
              </div>

              <div className="text-xs text-muted">
                <div className="font-semibold">{col.totalSupply || 'N/A'}</div>
                <div className="text-xs">items</div>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
