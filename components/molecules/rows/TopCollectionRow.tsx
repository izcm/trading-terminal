'use client'

import { TopNFTCollection } from '@/domain/types/nft-collection'
import { Stat } from '../Stat'

type Props = {
  collection: TopNFTCollection
}

export function TopCollectionRow({ collection }: Props) {
  const { activeAskCount, activeBidCount, activeCbCount, totalActive } = collection.summary

  return (
    <li className="base-row justify-between gap-4 p-2">
      <div className="w-40 flex items-center gap-4">
        <img
          src={collection.imageUrl || `placeholders/native-collections/${collection.symbol}.svg`}
          className="w-12 object-cover"
          alt="collection image"
        />

        <div className="flex flex-col">
          <span className="font-semibold">{collection.symbol || 'N/A'}</span>
          <span className="text-xs text-muted">{collection.name}</span>
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
}
