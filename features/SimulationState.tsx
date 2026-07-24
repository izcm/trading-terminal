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

const ResponsiveLabel = ({ full, short }: { full: string; short: string }) => (
  <>
    <span className="hidden min-[425px]:inline">{full}</span>
    <span className="min-[425px]:hidden">{short}</span>
  </>
)

const CollectionStats = ({ counts }: { counts: Counts }) => (
  <div className="flex flex-wrap gap-2 sm:gap-4 px-4 justify-around">
    <LabeledValue
      label={<ResponsiveLabel full="unique wallets" short="wallets" />}
      value={counts.traders}
    />
    <LabeledValue
      label={<ResponsiveLabel full="active orders" short="orders" />}
      value={counts.activeOrders}
    />
    <LabeledValue
      label={<ResponsiveLabel full="executed trades" short="trades" />}
      value={counts.trades}
    />
  </div>
)

export function SimulationState({ chainId, collections, collectionStats }: InitialState) {
  const [selected, setSelected] = useState<NFTCollection | undefined>(collections[0])
  const router = useRouter()

  return (
    <Gallery<NFTCollection>
      items={collections}
      galleryItem={c => (
        <div className="flex flex-col md:flex-row md:items-center p-1 md:p-0 cursor-pointer">
          <ImageRow
            image={`/collection_banners/${c.symbol}.svg`}
            title={c.name}
            subtitle={c.symbol}
            endContent={
              <LabeledValue label="sepolia" value={<Copyable value={addrShort(c.address)} />} />
            }
          />
          <div className="cursor-pointer">
            <CollectionStats counts={collectionStats[c.address]} />
          </div>
        </div>
      )}
      selected={selected}
      onSelect={c => setSelected(c)}
      onEnter={c => router.push(`/${c.chainId}/${c.address}`)}
      arrowClasses={{ selected: 'bg-accent/8 border-accent/80', default: 'bg-secondary/20 ' }}
    />
  )
}
