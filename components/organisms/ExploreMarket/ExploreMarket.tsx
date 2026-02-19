'use client'

import Link from 'next/link'
import { ArrowLeftRight, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { TopCollections } from '@/components/organisms/Lists/TopCollections'
import { Modal } from '@/components/molecules'
import { getListings } from '@/lib/dmrkt-indexer/actions/listings.get'

import { CreateOrderForm } from '@/features/orderbook/ui/CreateOrderForm'
import { TopNFTCollection } from '@/domain/types'
import { Listing } from '@/domain/types/listing'
import { ListingList } from '../Lists/ListingList'

type Props = {
  collections: TopNFTCollection[]
}

export const BrowseMarket = ({ collections }: Props) => {
  const [showNewForm, setShowNewForm] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    // const nextCursor = null

    const fetchMore = async () => {
      const res = await getListings('limit=50&status=active')

      if (res.ok) setListings(res.data.items)
    }

    fetchMore() // todo: implement endless scroll
  })

  return (
    <main className="flex flex-col gap-4 max-w-7xl mx-auto h-screen">
      <section className="flex justify-between items-center">
        <Link className="btn btn-ghost" href="/create-order">
          <ArrowLeftRight /> amm mode
        </Link>

        <h1 className="flex-1">d | feed</h1>

        <button className="btn btn-primary" onClick={() => setShowNewForm(true)}>
          <Plus /> create order
        </button>
      </section>

      <div className="flex-1 flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="card">
            <TopCollections collections={collections} />
          </div>

          <div className="flex-1 flex card">
            <ListingList listings={listings} />
          </div>
        </div>

        <ul className="basis-1/4 card">
          <li>carousel goes here later 🎠</li>
        </ul>
      </div>

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
