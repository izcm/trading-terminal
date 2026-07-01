'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { NFTCollection } from '@/domain/nft-collection'
import { ImageRow } from '@/ui/molecules/ImageRow'
import { Gallery } from '@/ui/molecules'
import { Copyable, LabeledValue } from '@/ui/atoms'
import { addrShort } from '@/lib/utils/hex'

type Count = number | string

type CollectionState = NFTCollection & {
  counts: {
    activeOrders: Count
    trades: Count
    traders: Count
  }
}

type InitialState = {
  chainId: number
  collections: NFTCollection[]
  collectionStates: CollectionState[]
}

const SimulationStats = ({ c }: { c: NFTCollection }) => (
  <div className="flex gap-4 px-1">
    <div className="px-2">
      <LabeledValue label="sepolia" value={<Copyable value={addrShort(c.address)} />} />
    </div>
    <div className="flex gap-4">
      <LabeledValue label="unique wallets" value={108} />
      <LabeledValue label="active orders" value={32} />
      <LabeledValue label="executed trades" value={102} />
    </div>
  </div>
)

export function SimulationState({ chainId, collections, collectionStates }: InitialState) {
  const [selected, setSelected] = useState<NFTCollection | undefined>(collections[0])
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
      <Gallery<NFTCollection>
        items={collections}
        galleryItem={c => (
          <ImageRow
            image={`/collection_banners/${c.symbol}.svg`}
            title={c.name}
            subtitle={c.symbol}
            endContent={<SimulationStats c={c} />}
            classNames={{ image: 'rounded-xl' }}
          />
        )}
        selected={selected}
        onSelect={c => setSelected(c)}
        onEnter={c => router.push(`/${chainId}/${c.address}`)}
        arrowClasses={{ selected: 'bg-accent/8 border-accent/80', default: 'bg-secondary/20 ' }}
      />
    </div>
  )
}
