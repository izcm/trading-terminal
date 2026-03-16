'use client' // boundry is here!

import { useEffect, useState } from 'react'

import { getDmrktListings, getDmrktSales } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { Paginated, Result } from '@/lib/utils/http'

import type { Listing } from '@/domain/listing'
import type { Sale } from '@/domain/sale'

import { Tab } from '@/ui/organisms/core/Tab'

import { useTradeValidation } from './trade/hooks/trade-validation.use'
import { TxTracker } from './trade/ui/TxTracker'
import { makeTabConfig } from './tab-config'
import { useTx } from '@/app/providers/TxProvider'
import { useKeyboardShortcuts } from './browse/hooks/keyboard-shortcuts.use'

type Page<T> = {
  items: T[]
  cursor: string | null
}

type TabResource = {
  feed: Listing
  sales: Sale
  // explore: NFT
}

type TabName = keyof TabResource

type InitialState = {
  [K in TabName]: Page<TabResource[K]>
}

type TabPages = {
  [K in TabName]: Page<TabResource[K]>
}

type PageGetters<K extends keyof TabResource> = (
  limit: number,
  cursor: string | null
) => Promise<Result<Paginated<TabResource[K]>>>

const pageGetters: { [K in keyof TabResource]: PageGetters<K> } = {
  feed: getDmrktListings,
  sales: getDmrktSales,
  // explore: getDmrktCollections,
}

export function MarketplaceView(initial: InitialState) {
  // providers
  const { txs } = useTx()

  // effects
  useKeyboardShortcuts({ f: () => setTab('feed'), s: () => setTab('sales') })

  // on tx success => remove listing from feed

  // tab state
  const [tab, setTab] = useState<TabName>('feed')
  const [state, setState] = useState<TabPages>(initial)

  const current = state[tab]

  useEffect(() => {
    if (!current.cursor) return

    const fetchMore = async () => {
      const res = await pageGetters[tab](10, current.cursor)

      if (res.ok) {
        const { nextCursor, items: newItems } = res.data

        setState(prev => ({
          ...prev,
          [tab]: { items: [...prev[tab].items, ...newItems], cursor: nextCursor },
        }))
      }
    }

    fetchMore()
  }, [current.cursor])

  const [selectedByTab, setSelectedByTab] = useState<{ [K in TabName]: TabResource[K] | null }>({
    feed: initial.feed.items[0] ?? null,
    sales: initial.sales.items[0] ?? null,
  })

  const selected = selectedByTab[tab]

  const simulation = useTradeValidation(tab === 'feed' ? (selected as Listing).rawOrder : undefined)

  const tabConfig = makeTabConfig({ isFillable: simulation.isFillable })
  const ui = tabConfig[tab]

  return (
    <div className="flex gap-4 h-screen max-w-4xl mx-auto overflow-hidden font-mono">
      {/* ---- main content ---- */}
      <main className="flex flex-col mt-4 items-center gap-4">
        <div className="flex items-center justify-between w-full gap-2 px-1 text-accent">
          <div className="basis-1/4 flex">
            <button className="btn btn-accent h-[27px]">+ new order</button>
          </div>
          <div>
            <button className="menuBtn">[ Swords ]</button>

            <button className="menuBtn">[ Elixirs ]</button>

            <button className="menuBtn">[ Shields ]</button>

            <button className="menuBtn">[ Eggs ]</button>
          </div>
          <div className="basis-1/4 flex justify-end">
            <TxTracker />
          </div>
        </div>

        <div className="flex w-full border-b border-soft">
          {(Object.keys(tabConfig) as TabName[]).map(title => (
            <button
              key={title}
              onClick={() => setTab(title)}
              className={`
            flex-1 py-2 text-center border-b-2 transition cursor-pointer
        ${
          title === tab
            ? 'border-accent-weak text-accent-weak'
            : 'border-transparent text-muted hover:text-accent/70'
        }
      `}
            >
              {title.charAt(0).toUpperCase() + title.slice(1)}
            </button>
          ))}
        </div>

        <Tab
          items={state[tab].items}
          selected={selected ?? undefined}
          onSelect={item =>
            setSelectedByTab(prev => ({
              ...prev,
              [tab]: item,
            }))
          }
          galleryItem={item => ui['galleryItem'](item as any)}
          mainActionBtn={item => ui.mainActionBtn(item as any)}
          details={item => ui['details'](item as any)}
        />
      </main>
    </div>
  )
}
