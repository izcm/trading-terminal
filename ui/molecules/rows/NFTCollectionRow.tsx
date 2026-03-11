'use client'

import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
import { Stat } from '../Stat'

type Props = {
  collection: NFTCollection
}

export function NFTCollectionRow({ collection }: Props) {
  const summary = collection.summary

  return (
    <>
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

      {summary && (
        <>
          <div className="flex-1 flex justify-evenly text-muted">
            <Stat value={summary.activeAskCount} label={'asks'} />
            <Stat value={summary.activeBidCount} label={'bids'} />
            <Stat value={summary.activeCbCount} label={'cbs'} />
          </div>

          <div className="w-20">
            <Stat value={summary.totalActive} label={'total'} />
          </div>
        </>
      )}
    </>
  )
}
