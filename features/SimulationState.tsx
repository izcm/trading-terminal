'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { addrShort } from '@/lib/utils/hex'

import { NFTCollection } from '@/domain/nft-collection'
import { Hex } from '@/domain/shared/eth'

import { ImageRow, Gallery } from '@/ui/molecules'
import { Copyable, LabeledValue } from '@/ui/atoms'

type Count = number | string

type Counts = {
  activeOrders: Count
  trades: Count
  traders: Count
}

type InitialState = {
  chainId: number
  collections: NFTCollection[]
  collectionStats: Record<Hex, Counts>
}

const SimulationStats = ({ address, counts }: { address: Hex; counts: Counts }) => (
  <div className="flex gap-4 px-1">
    <div className="px-2">
      <LabeledValue label="sepolia" value={<Copyable value={addrShort(address)} />} />
    </div>
    <div className="flex gap-4">
      <LabeledValue label="unique wallets" value={counts.traders} />
      <LabeledValue label="active orders" value={counts.activeOrders} />
      <LabeledValue label="executed trades" value={counts.trades} />
    </div>
  </div>
)

export function SimulationState({ chainId, collections, collectionStats }: InitialState) {
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
            endContent={<SimulationStats address={c.address} counts={collectionStats[c.address]} />}
            classNames={{ image: 'rounded-xl', root: 'max-w-[640px]' }}
          />
        )}
        selected={selected}
        onSelect={c => setSelected(c)}
        onEnter={c => router.push(`/${c.chainId}/${c.address}`)}
        arrowClasses={{ selected: 'bg-accent/8 border-accent/80', default: 'bg-secondary/20 ' }}
      />
    </div>
  )
}
