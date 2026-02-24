'use client'

import { use, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

import { ListingRow, TopCollectionRow } from '@/components/molecules'
import { TopNFTCollection, ListingDTO } from '@/domain/types'
import { Result } from '@/lib/utils/http'
import { getListings, PaginatedListings } from '@/lib/dmrkt-indexer/actions/listings.get'
import { CreateOrderForm } from '@/components/organisms/CreateOrderForm'
import { TradePanel } from './tradepanel/TradePanel'
import { ArrowList, ArrowRow, Modal } from '@/components/atoms'

type Props = {
  collections: TopNFTCollection[]
  initialData: Promise<Result<PaginatedListings>>
}

type OrderUIState = {
  previewSrc: string
  isFillable: boolean
  validating: boolean
  txPending: boolean
  error?: string
}

export function Feed({ collections, initialData }: Props) {
  const initial = use(initialData)

  const data = initial.ok ? initial.data : { items: [], nextCursor: null }

  const [nextCursor, setNextCursor] = useState<string | null>(data.nextCursor)

  const [listings, setListings] = useState<ListingDTO[]>(data.items)
  const [selected, setSelected] = useState<ListingDTO>(data.items[0])

  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    if (!nextCursor) return

    const fetchMore = async () => {
      const res = await getListings('limit=50')
      if (res.ok) {
        const { nextCursor, items } = res.data

        setNextCursor(nextCursor)
        setListings(prev => [...prev, ...items])
      }
    }

    fetchMore()
  }, [nextCursor])

  if (!initial.ok) {
    return <div className="card">failed to load sales 💀</div>
  }

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

          <ArrowList
            items={collections}
            getId={c => `${c.chainId}:${c.address}`}
            selectedId={selected.id}
            onSelect={() => alert('hello')}
            className="shrink-0"
          >
            {({ item, isSelected, onSelect }) => (
              <ArrowRow
                key={`${item.chainId}:${item.address}`}
                isSelected={isSelected}
                onSelect={onSelect}
                className="p-1"
              >
                <TopCollectionRow collection={item} />
              </ArrowRow>
            )}
          </ArrowList>

          <ArrowList
            items={listings}
            getId={l => l.id}
            selectedId={selected.id}
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
