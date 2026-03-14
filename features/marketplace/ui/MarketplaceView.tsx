'use client' // boundry is here!

import { ReactNode, useEffect, useState } from 'react'

import {
  getDmrktCollections,
  getDmrktListings,
  getDmrktSales,
} from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { Paginated, Result } from '@/lib/utils/http'

import { activity } from '@/domain/shared/activity'
import type { Listing } from '@/domain/listing'
import type { Sale } from '@/domain/sale'

import { Gallery, NFTPreview } from '@/ui/organisms'
import { ActivityItem, NFTRow } from '@/ui/molecules'
import { TextInput } from '@/ui/atoms'

import { SaleDetails } from '@/features/sales/ui/SaleDetails'
import { ListingDetails } from '@/features/trade/ui/ListingDetails'

type Page<T> = {
  items: T[]
  cursor: string | null
}

type ViewResource = {
  feed: Listing
  sales: Sale
  // explore: NFT
}

type View = keyof ViewResource

type ViewPages = {
  [K in View]: Page<ViewResource[K]>
}

type PageGetters<K extends keyof ViewResource> = (
  limit: number,
  cursor: string | null
) => Promise<Result<Paginated<ViewResource[K]>>>

const pageGetters: { [K in keyof ViewResource]: PageGetters<K> } = {
  feed: getDmrktListings,
  sales: getDmrktSales,
  // explore: getDmrktCollections,
}

type InitialState = {
  [K in View]: Page<ViewResource[K]>
}

const stateUI = {
  feed: {
    galleryItem: (item: Listing) => <ActivityItem activity={activity.fromListing(item)} />,
    details: (item: Listing) => <ListingDetails listing={item} />,
  },
  sales: {
    galleryItem: (item: Sale) => <ActivityItem activity={activity.fromSale(item)} />,
    details: (item: Sale) => <SaleDetails sale={item} />,
  },
}

export function MarketplaceView(initial: InitialState) {
  const [view, setView] = useState<View>('sales')

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      // don't trigger while typing
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (e.key === 'f') setView('feed')
      if (e.key === 's') setView('sales')
      // if (e.key === 'e') setView('explore')
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const [state, setState] = useState<ViewPages>(initial)

  const current = state[view]

  useEffect(() => {
    if (!current.cursor) return

    const fetchMore = async () => {
      const res = await pageGetters[view](10, current.cursor)

      if (res.ok) {
        const { nextCursor, items: newItems } = res.data

        setState(prev => ({
          ...prev,
          [view]: { items: [...prev[view].items, ...newItems], cursor: nextCursor },
        }))
      }
    }

    fetchMore()
  }, [current.cursor])

  const [selectedByView, setSelectedByView] = useState<{ [K in View]: ViewResource[K] | null }>({
    feed: initial.feed.items[0] ?? null,
    sales: initial.sales.items[0] ?? null,
  })

  const ui = stateUI[view]
  const selected = selectedByView[view]

  return (
    <div className="flex h-screen max-w-4xl mx-auto overflow-hidden font-mono">
      {/* sidebar */}
      {/* <aside className="flex h-full items-center">
        <div className="flex flex-col">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              data-active={view === item.id}
              className="btn btn-ghost min-w-[120px]"
            >
              {item.title}
            </button>
          ))}
        </div>
      </aside> */}

      {/* ---- main content ---- */}
      <main className="flex flex-col items-center gap-4">
        <div className="my-4 flex gap-2 px-1 text-accent">
          <button className="menuBtn">[ Swords ]</button>

          <button className="menuBtn">[ Elixirs ]</button>

          <button className="menuBtn">[ Shields ]</button>

          <button className="menuBtn">[ Eggs ]</button>
        </div>

        <div className="min-h-0 flex gap-4 justify-center">
          <div className="flex-1 flex flex-col gap-4">
            <TextInput />

            <Gallery<any>
              items={state[view].items}
              selected={selectedByView[view]}
              onSelect={item =>
                setSelectedByView(prev => ({
                  ...prev,
                  [view]: item,
                }))
              }
              galleryItem={item => ui['galleryItem'](item as any)}
            />
          </div>

          <div className="basis-1/4 flex flex-col gap-3 mb-2">
            <button className="btn btn-secondary">open receipt 2.0</button>

            <div className="pointer-events-none">
              <NFTPreview
                chainId={selected?.chainId}
                address={selected?.collection}
                tokenId={selected?.tokenId}
              />
            </div>

            {selected && (
              <div className="flex-1 card bg-secondary">{ui['details'](selected as any)}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
