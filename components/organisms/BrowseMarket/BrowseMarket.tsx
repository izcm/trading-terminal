'use client'

import Link from 'next/link'
import { ArrowLeftRight, Plus } from 'lucide-react'
import { useState } from 'react'

import { TopCollections } from '@/components/organisms/CollectionsList/TopCollections'
import { Modal } from '@/components/molecules'
import { CreateOrderForm } from '@/features/orderbook/ui/CreateOrderForm'
import { NFTCollection, TopNFTCollection } from '@/domain/types'

type Props = {
  collections: TopNFTCollection[]
}

export const BrowseCollections = ({ collections }: Props) => {
  console.log(collections)
  const [showNewForm, setShowNewForm] = useState(false)

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

          <div className="flex-1 flex card">latest active orders</div>
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
