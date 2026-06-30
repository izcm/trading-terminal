'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { NFT_PLACEHOLDER_IMAGE } from '@/domain/constants/placeholders'

import { NFTCollection } from '@/domain/nft-collection'
import { ImageRow } from '@/ui/organisms/rows/ImageRow'
import { Gallery } from '@/ui/molecules'

type InitialState = {
  chainId: number
  collections: NFTCollection[]
}

// pass collections and counts of bids / asks
// pass demo users
export function SimulationState({ chainId, collections }: InitialState) {
  const [selected, setSelected] = useState<NFTCollection | undefined>(collections[0])
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
      <Gallery<NFTCollection>
        items={collections}
        galleryItem={c => <ImageRow image={`/collection_banners/${c.symbol}.svg`} title={c.name} />}
        selected={selected}
        onSelect={c => setSelected(c)}
        onEnter={c => router.push(`/11155111/${c.address}`)}
        arrowClasses={{ selected: 'bg-secondary/20 border-accent/80', default: 'bg-secondary/20 ' }}
      />
    </div>
  )
}
