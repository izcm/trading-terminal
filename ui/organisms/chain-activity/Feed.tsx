'use client'

import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

// todo: make some new object do decouple from indexer
import { getListings } from '@/lib/dmrkt-indexer/actions/listings.get'
import type { Listing } from '@/lib/dmrkt-indexer/types/listing'
import type { TopNFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

import { CreateOrderForm } from '../../../features/trade/ui/CreateOrderForm'
import { TradePanel } from '../../../features/trade/ui/TradePanel'

import { ArrowList, ArrowRow, Modal } from '@/ui/components/atoms'
import { ListingRow, TopCollectionRow } from '@/ui/molecules'

export type FeedProps = {
  collections: TopNFTCollection[]
  initialListings: Listing[]
  initialCursor: string | null
}

export function Feed({ collections, initialListings, initialCursor }: FeedProps) {
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor)

  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [selected, setSelected] = useState<Listing | null>(
    initialListings.length ? initialListings[0] : null
  )

  const [showNewForm, setShowNewForm] = useState(false)

  // todo: make this on scroll
  useEffect(() => {
    if (!nextCursor) return

    const fetchMore = async () => {
      const res = await getListings(`limit=50&status=active&cursor=${nextCursor}`)

      if (res.ok) {
        const { nextCursor, items } = res.data

        setNextCursor(nextCursor)
        setListings(prev => [...prev, ...items])
      }
    }

    fetchMore()
  }, [nextCursor])

  return (
    <div className="h-full flex flex-col gap-4">
      {/* ---------- HEADER ---------- */}
      <button className="btn btn-secondary self-end" onClick={() => setShowNewForm(true)}>
        <Plus /> create order
      </button>

      <div className="h-full flex gap-4 overflow-hidden">
        {/* LEFT COLUMN (feed side) */}
        <div className="flex-1 flex flex-col gap-4">
          {/* collections */}
          <ArrowList
            items={collections}
            getId={c => c.id}
            selectedId={undefined}
            onSelect={() => alert('hello')}
            className="shrink-0"
          >
            {({ item, isSelected, onSelect }) => (
              <ArrowRow key={item.id} isSelected={isSelected} onSelect={onSelect} className="p-1">
                <TopCollectionRow collection={item} />
              </ArrowRow>
            )}
          </ArrowList>

          <ArrowList
            items={listings}
            getId={l => l.id}
            selectedId={selected?.id}
            onSelect={setSelected}
          >
            {({ item, isSelected, onSelect }) => (
              <ArrowRow
                key={item.id}
                isSelected={isSelected}
                onSelect={onSelect}
                className="gap-4 p-2"
              >
                <ListingRow listing={item} />
              </ArrowRow>
            )}
          </ArrowList>
        </div>

        {/* RIGHT PANEL */}
        <div className="basis-1/4">
          <TradePanel listing={selected} />
        </div>
      </div>

      {/* MODAL */}
      {showNewForm && (
        <Modal isOpen={showNewForm} onClose={() => setShowNewForm(false)}>
          <div className="w-120">
            <CreateOrderForm />
          </div>
        </Modal>
      )}
    </div>
  )
}
