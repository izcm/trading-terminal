'use client' // boundry is here!

import React, { ReactNode, useEffect, useState } from 'react'

import { getDmrktListings, getDmrktSales } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { Paginated, Result } from '@/lib/utils/http'

import type { Listing } from '@/domain/listing'
import type { Sale } from '@/domain/sale'

import { Gallery, NFTPreview } from '@/ui/organisms'
import { TextInput } from '@/ui/atoms'

import { useTradeValidation } from '@/features/trade/hooks/trade-validation.use'

import { makeViewConfig } from '../view-config'
import { TxTracker } from '../TxTracker'

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

type InitialState = {
  [K in View]: Page<ViewResource[K]>
}

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

export function MarketplaceView(initial: InitialState) {
  const [view, setView] = useState<View>('feed')
  const [modalOpen, isModalOpen] = useState<boolean>(false)

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

  const selected = selectedByView[view]

  const simulation = useTradeValidation(
    view === 'feed' ? (selected as Listing).rawOrder : undefined
  )

  const viewConfig = makeViewConfig({ isFillable: simulation.isFillable })
  const ui = viewConfig[view]

  return (
    <div className="flex gap-4 h-screen max-w-4xl mx-auto overflow-hidden font-mono">
      {/* ---- main content ---- */}
      <main className="flex flex-col mt-4 items-center gap-4">
        <div className="flex items-center justify-between w-full gap-2 px-1 text-accent">
          <div className="basis-1/4"></div>
          <div className="1/2">
            <button className="menuBtn">[ Swords ]</button>

            <button className="menuBtn">[ Elixirs ]</button>

            <button className="menuBtn">[ Shields ]</button>

            <button className="menuBtn">[ Eggs ]</button>
          </div>
          <div className="basis-1/4">
            <TxTracker />
          </div>
        </div>

        <div className="flex w-full border-b border-soft">
          {(Object.keys(viewConfig) as View[]).map(title => (
            <button
              key={title}
              onClick={() => setView(title)}
              className={`
            flex-1 py-2 text-center border-b-2 transition cursor-pointer
        ${
          title === view
            ? 'border-accent-weak text-accent-weak'
            : 'border-transparent text-muted hover:text-accent/70'
        }
      `}
            >
              {title.charAt(0).toUpperCase() + title.slice(1)}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex gap-4 justify-center">
          <div className="flex-1 flex flex-col gap-4">
            <TextInput />

            <Gallery<ViewResource[View]>
              items={state[view].items}
              selected={selected as any}
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
            <div className="pointer-events-none">
              <NFTPreview
                chainId={selected?.chainId}
                address={selected?.collection}
                tokenId={selected?.tokenId}
              />
            </div>
            {selected && ui.mainActionBtn(selected as any)}
            {selected && <div className="card bg-secondary">{ui['details'](selected as any)}</div>}
          </div>
        </div>
      </main>
    </div>
  )
}
