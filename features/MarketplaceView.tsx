'use client' // boundry is here!

import { useEffect, useState } from 'react'

import { useTx } from '@/app/providers/TxProvider'
import type { Page } from '@/lib/utils/http'
import type { Listing } from '@/domain/listing'

import { Tab } from '@/ui/organisms/core/Tab'

// hooks
import { useKeyboardShortcuts } from './browse/hooks/keyboard-shortcuts.use'

// trade
import { useTradeValidation } from './trade/hooks/trade-validation.use'
import { TxTracker } from './trade/ui/TxTracker'

// tab config
import { makeTabUiConfig, pageGetters, type TabName, type TabResource } from './tab-config'
import { useFeedTxSync } from './browse/hooks/feed-tx-sync.use'

type InitialState = {
  [K in TabName]: Page<TabResource[K]>
}

type TabPages = {
  [K in TabName]: Page<TabResource[K]>
}

export function MarketplaceView(initial: InitialState) {
  // hook subs
  useKeyboardShortcuts({ f: () => setTab('feed'), s: () => setTab('sales') })
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

  const tabUiConfig = makeTabUiConfig({ isFillable: simulation.isFillable })
  const ui = tabUiConfig[tab]

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
