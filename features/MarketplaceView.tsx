'use client' // boundry is here!

import { useEffect, useState } from 'react'

import { getDmrktListing } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { Page } from '@/lib/utils/http'
import type { Listing } from '@/domain/listing'

import { Tab } from '@/ui/organisms/core/Tab'

// hooks
import { useKeyboardShortcuts } from './keyboard-shortcuts.use'

// trade
import { useTradeValidation } from './trade/hooks/trade-validation.use'
import { TxTracker } from './trade/ui/TxTracker'

// tab config
import { makeTabUiConfig, pageGetters, type TabName, type TabResource } from './tab-config'
import { useFeedTxSync } from './browse/hooks/feed-tx-sync.use'
import { CreateOrderBtn } from './orders/ui/CreateOrderBtn'

type InitialState = {
  [K in TabName]: Page<TabResource[K]>
}

type TabPages = {
  [K in TabName]: Page<TabResource[K]>
}

export function MarketplaceView(initial: InitialState) {
  // hook subs
  useKeyboardShortcuts({ fn: () => setTab('feed'), s: () => setTab('sales') })
  useFeedTxSync(updateFeed) // on tx success => remove listing from feed

  // tab state
  const [tab, setTab] = useState<TabName>('feed')
  const [state, setState] = useState<TabPages>(initial)

  function updateFeed(fn: (feed: Page<Listing>) => Page<Listing>) {
    setState(prev => ({
      ...prev,
      feed: fn(prev.feed),
    }))
  }

  const current = state[tab]

  useEffect(() => {
    if (!current.cursor) return

    const fetchMore = async () => {
      const res = await pageGetters[tab](10, current.cursor)

      if (res.ok) {
        const { cursor: nextCursor, items: newItems } = res.data

        // build set:        O(n)
        // filter newItems:  O(m)
        // total:            O(n + m)
        setState(prev => {
          // orderhash exists on both listing + settlement
          const existing = new Set(prev[tab].items.map(i => i.orderHash))

          return {
            ...prev,
            [tab]: {
              items: [...prev[tab].items, ...newItems.filter(n => !existing.has(n.orderHash))],
              cursor: nextCursor,
            },
          }
        })
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

  const tabUiConfig = makeTabUiConfig({ isFillable: simulation.isFillable })
  const ui = tabUiConfig[tab]

  return (
    <div className="flex gap-4 h-screen max-w-4xl px-2 mx-auto overflow-hidden font-mono">
      {/* ---- main content ---- */}
      <main className="flex flex-col mt-4 items-center gap-4">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="basis-1/4 flex">
            {/* todo: make nice way to pass chainid in case of later multichain */}
            {/* todo important: change this buggy [0] thing asap very important */}
            <CreateOrderBtn
              chainId={31337}
              collection={state.feed.items[0].collection}
              onOrderCreated={async id => {
                const res = await getDmrktListing(id)
                if (!res.ok) return
                const listing = res.data
                console.log(listing)

                updateFeed(feed => ({
                  ...feed, // cursor etc
                  items: [listing, ...feed.items.filter(i => i.orderHash !== listing.orderHash)],
                }))
              }}
            />
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
          {(Object.keys(tabUiConfig) as TabName[]).map(title => (
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
