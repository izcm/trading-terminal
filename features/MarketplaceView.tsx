'use client' // boundry is here!

import { useState } from 'react'

import type { Page } from '@/lib/utils/http'
import { TextInput } from '@/ui/atoms'

// hooks
import { useKeyboardShortcuts } from './hooks/keyboard-shortcuts.use'

// features
import { TxTracker } from './trade/ui/TxTracker'
import { CreateOrderBtn } from './orders/ui/CreateOrderBtn'

// tab config
import { pageGetters, type TabName, type TabResource } from './tab-config'
import { FeedTab, SalesTab } from './Tabs'
import { useTabData } from './hooks/tab-data.use'

type InitialState = {
  [K in TabName]: Page<TabResource[K]>
}

export function MarketplaceView(initial: InitialState) {
  // useEffect subs
  useKeyboardShortcuts({
    f: () => setTab('feed'),
    s: () => setTab('sales'),
  })

  // tab state
  const [tab, setTab] = useState<TabName>('feed')

  const feed = useTabData(pageGetters.feed, { status: 'active' })
  const sales = useTabData(pageGetters.sales, { status: 'expired' })

  const data = tab === 'feed' ? feed : sales

  return (
    <div className="flex gap-4 h-screen max-w-4xl px-2 mx-auto overflow-hidden font-mono">
      {/* ---- main content ---- */}
      <main className="flex flex-col mt-4 items-center gap-4">
        <div className="flex items-center justify-between w-full gap-4">
          <div>
            {/* todo: make nice way to pass chainid in case of later multichain */}
            {/* todo important: change this buggy [0] thing asap very important */}
            {feed.items.length && (
              <CreateOrderBtn chainId={31337} collection={feed.items[0].collection} />
            )}
          </div>
          <div className="flex gap-4">
            <button className="menuBtn">[ Swords ]</button>

            <button className="menuBtn">[ Elixirs ]</button>

            <button className="menuBtn">[ Shields ]</button>

            <button className="menuBtn">[ Eggs ]</button>
          </div>
          <div className="flex justify-end">
            <TxTracker />
          </div>
        </div>

        <div className="flex w-full border-b border-soft">
          {['feed', 'sales'].map(title => (
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

        <div className="min-h-0 flex-col flex gap-4 justify-center">
          <TextInput
            key={tab}
            defaultValue={Object.entries(feed.filters)
              .map(([k, v]) => `${k}=${v}`)
              .join('&')}
          />
          {tab === 'feed' && <FeedTab data={feed} />}
          {tab === 'sales' && <SalesTab data={sales} />}
        </div>
      </main>
    </div>
  )
}
