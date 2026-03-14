import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

import { NFT } from '@/domain/nft'

import { Gallery } from '@/ui/organisms'
import { NFTRow } from '@/ui/molecules'
import { useState } from 'react'

export type ExploreProps = {
  initialItems: {
    nfts: NFT[]
    collections: NFTCollection[]
  }
  initialCursor: string | null
}

// what?

export function ExploreTab({ initialItems, initialCursor }: ExploreProps) {
  const [selected, setSelected] = useState<NFT | null>(initialItems.nfts[0] ?? null)

  if (!selected) return null

  return (
    <>
      <Gallery<NFT>
        items={initialItems.nfts}
        galleryItem={item => <NFTRow nft={item} />}
        selected={selected}
        onSelect={setSelected}
        galleryView="list"
      />
    </>
  )
}
