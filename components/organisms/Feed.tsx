'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { Plus, CreditCard } from 'lucide-react'

import { TopCollections } from '@/components/organisms/Explore/TopCollections'
import { Modal, ListingRow, ListingDetails } from '@/components/molecules'

import { TopNFTCollection } from '@/domain/types'
import { Listing } from '@/domain/types/listing'

import { Result } from '@/lib/utils/http'
import { getListings, PaginatedListings } from '@/lib/dmrkt-indexer/actions/listings.get'
import { CreateOrderForm } from '@/features/orderbook/ui/CreateOrderForm'
import { getImageFromTokenURI, resolveImage } from '@/lib/utils/image'

import { useTokenURI } from '@/lib/blockchain/hooks/token-uri.use'
import { useOrderValidation } from '@/lib/blockchain/orderbook/hooks/validate-order.use'
import { TradePanel } from './TradePanel/TradePanel'

type Props = {
  collections: TopNFTCollection[]
  initialListings: Promise<Result<PaginatedListings>>
}

type OrderUIState = {
  previewSrc: string
  isFillable: boolean
  validating: boolean
  txPending: boolean
  error?: string
}

export function Feed({ collections, initialListings }: Props) {
  const initial = use(initialListings)

  if (!initial.ok) {
    return <div className="card">failed to load sales 💀</div>
  }

  const [nextCursor, setNextCursor] = useState<string | null>(initial.data.nextCursor)

  const [listings, setListings] = useState<Listing[]>(initial.data.items)
  const [selected, setSelected] = useState<Listing>(initial.data.items[0])

  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    if (!nextCursor) return

    const fetchMore = async () => {
      const res = await getListings('limit=50&status=active')
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
      <section className="flex justify-between items-center">
        <div>only 4u / all</div>
        <button className="btn btn-secondary" onClick={() => setShowNewForm(true)}>
          <Plus /> create order
        </button>
      </section>

      <div className="h-full flex gap-4 overflow-hidden">
        {/* LEFT COLUMN (feed side) */}
        <div className="flex-1 flex flex-col gap-4">
          {/* collections */}
          <div className="card shrink-0">
            <TopCollections collections={collections} />
          </div>

          <div className="card flex-1 overflow-y-auto no-scrollbar">
            <ul className="w-full">
              {listings.map(item => (
                <ListingRow key={item.id} listing={item} onSelect={setSelected} />
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside className="w-1/4 flex flex-col gap-4">
          <TradePanel listing={selected} />
        </aside>
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
