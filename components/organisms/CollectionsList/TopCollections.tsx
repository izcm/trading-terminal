'use client'

import Link from 'next/link'

import { NFTCollection, TopNFTCollection } from '@/domain/types'

interface CollectionListProps {
  collections: TopNFTCollection[]
}

export const TopCollections = ({ collections }: CollectionListProps) => {
  return (
    <ul className="overflow-y-auto no-scrollbar">
      {collections.map((col, i) => {
        return (
          <li key={`${col.chainId}:${col.address}`}>
            <Link href={`/collections/${col.address}`} className="interactive-row p-2 filter-row">
              <img
                src={col.imageUrl || `/${col.symbol}.svg`}
                className="w-12 object-cover"
                alt="collection image"
              />

              <div>
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
