'use client'

import Link from 'next/link'

import { NFTCollection, TopNFTCollection } from '@/domain/types'
import { Stat } from '@/components/molecules'

interface CollectionListProps {
  collections: TopNFTCollection[]
}

export function TopCollections({ collections }: CollectionListProps) {
  return (
    <ul className="overflow-y-auto no-scrollbar">
      {collections.map((col, i) => {
        const { activeAskCount, activeBidCount, activeCbCount, totalActive } = col.summary

        return (
          <li key={`${col.chainId}:${col.address}`} className="base-row justify-between gap-4 p-2">
            <div className="w-40 flex items-center gap-4">
              <img
                src={col.imageUrl || `native-collections/${col.symbol}.svg`}
                className="w-12 object-cover"
                alt="collection image"
              />

              <div className="flex flex-col">
                <span className="font-semibold">{col.symbol || 'N/A'}</span>
                <span className="text-xs text-muted">{col.name}</span>
              </div>
            </div>

            <div className="flex-1 flex justify-evenly text-muted">
              <Stat value={activeAskCount} label={'asks'} />
              <Stat value={activeBidCount} label={'bids'} />
              <Stat value={activeCbCount} label={'cbs'} />
            </div>

            <div className="w-20">
              <Stat value={totalActive} label={'total'} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
