'use client'

import Link from 'next/link'
import { ChartArea, Plus, CreditCard } from 'lucide-react'
import { use, useEffect, useState } from 'react'

import { TopCollections } from '@/components/organisms/Lists/TopCollections'
import { Modal, ListingRow } from '@/components/molecules'
import { getListings, PaginatedListings } from '@/lib/dmrkt-indexer/actions/listings.get'

import { CreateOrderForm } from '@/features/orderbook/ui/CreateOrderForm'
import { TopNFTCollection } from '@/domain/types'
import { Listing } from '@/domain/types/listing'
import { Result } from '@/lib/utils/http'

type Props = {
  collections: TopNFTCollection[]
  initialListings: Promise<Result<PaginatedListings>>
}

export const BrowseMarket = ({ collections, initialListings }: Props) => {
  const initial = use(initialListings)

  if (!initial.ok) {
    return <div className="card">failed to load sales 💀</div>
  }

  const [showNewForm, setShowNewForm] = useState(false)
  const [listings, setListings] = useState<Listing[]>(initial.data.items)

  useEffect(() => {
    const fetchMore = async () => {
      const res = await getListings('limit=50&status=active')
      if (res.ok) setListings(res.data.items)
    }
    fetchMore()
  }, [])

  return (
    <main className="h-screen overflow-hidden flex flex-col max-w-7xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <section className="flex justify-between items-center gap-4 shrink-0 py-4">
        <Link className="btn btn-ghost" href="./">
          <ChartArea /> sales analytics
        </Link>

        <h1 className="flex-1 text-center">d | feed</h1>

        <button className="btn btn-accent" onClick={() => setShowNewForm(true)}>
          <Plus /> create order
        </button>
      </section>

      <div className="flex gap-4 overflow-hidden">
        {/* LEFT COLUMN (feed side) */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* collections */}
          <div className="card shrink-0">
            <TopCollections collections={collections} />
          </div>

          <div className="card flex-1 overflow-y-auto no-scrollbar mi">
            <ul className="w-full">
              {listings.map(item => (
                <ListingRow key={item.id} listing={item} />
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside className="basis-1/4 flex flex-col gap-4 shrink-0">
          {/* preview */}
          <div className="h-60 card grid place-items-center shrink-0">
            <img src={`/avatars/bot.svg`} className="w-1/2 object-contain" alt="user avatar" />
          </div>

          <button className="btn btn-primary my-1">
            <CreditCard /> buy now
          </button>

          {/* details area */}
          <div className="card flex-1 overflow-y-auto">
            Put user recent order history / subscriptions here
          </div>
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
    </main>
  )
}
