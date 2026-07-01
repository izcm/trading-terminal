'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { NFTCollection } from '@/domain/nft-collection'
import { ImageRow } from '@/ui/molecules/ImageRow'
import { Gallery } from '@/ui/molecules'
import { Copyable, LabeledValue } from '@/ui/atoms'
import { addrShort } from '@/lib/utils/hex'

type InitialState = {
  chainId: number
  collections: NFTCollection[]
}

const SimulationStats = ({ c }: { c: NFTCollection }) => (
  <div className="flex gap-4 mx-2">
    <div className="flex flex-col justify-center text-sm">
      <Copyable value={addrShort(c.address)} />
      <span className="text-xs text-muted">sepolia</span>
    </div>
    <div className="flex gap-4 px-2">
      <LabeledValue label="demo users" value={108} />
      <LabeledValue label="active orders" value={32} />
      <LabeledValue label="executed trades" value={102} />
    </div>
  </div>
)

export function SimulationState({ chainId, collections }: InitialState) {
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
