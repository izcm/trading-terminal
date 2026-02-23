'use client'

import { use, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

import { ListingRow, TopCollectionRow } from '@/components/molecules'
import { TopNFTCollection, Listing } from '@/domain/types'
import { Result } from '@/lib/utils/http'
import { getListings, PaginatedListings } from '@/lib/dmrkt-indexer/actions/listings.get'
import { CreateOrderForm } from '@/components/organisms/CreateOrderForm'
import { TradePanel } from './tradepanel/TradePanel'
import { Modal } from '@/components/atoms'

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
  const [activeIndex, setActiveIndex] = useState(0)

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
          <ul className="card shrink-0 overflow-y-auto no-scrollbar">
            {collections.map(collection => (
              <TopCollectionRow
                key={`${collection.chainId}:${collection.address}`}
                collection={collection}
              />
            ))}
          </ul>

          <ul
            className="card flex-1 overflow-y-auto no-scrollbar"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Home') {
                e.preventDefault()
                setSelected(listings[0])
                return
              }

              if (e.key === 'End') {
                e.preventDefault()
                setSelected(listings[listings.length - 1])
                return
              }

              if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
              e.preventDefault()

              const index = listings.findIndex(l => l.id === selected.id)
              if (index === -1) return

              let next = index
              if (e.key === 'ArrowDown') next = Math.min(index + 1, listings.length - 1)
              if (e.key === 'ArrowUp') next = Math.max(index - 1, 0)

              setSelected(listings[next])
            }}
          >
            {listings.map(item => (
              <ListingRow
                key={item.id}
                listing={item}
                onSelect={setSelected}
                selected={selected.id === item.id}
              />
            ))}
          </ul>
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
