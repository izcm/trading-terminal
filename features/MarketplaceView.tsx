'use client' // boundry is here!

import { useCallback, useEffect, useState } from 'react'

import { connectWs } from '@/lib/realtime/ws'
import type { Page } from '@/lib/utils/http'

// shared components
import { TextInput } from '@/ui/atoms'

// hooks
import { useKeyboardShortcuts } from './hooks/keyboard-shortcuts.use'
import { useTabMutations } from './hooks/tab-mutations.use'
import { useWsFeed, useWsSales } from './realtime/hooks/ws-sub.use'
import { useFresh } from './hooks/fresh.use'

// features
import { TxTracker } from './realtime/ui/TxTracker'
import { CreateOrderBtn } from './orders/ui/CreateOrderBtn'

// tab config
import { pageGetters, TabResource, tabUIConfig, type TabName } from './tab-config'
import { Tabs } from './Tabs'

type InitialState = {
  [K in TabName]: Page<TabResource[K]>
}

type TabPages = {
  [K in TabName]: Page<TabResource[K]>
}

export function MarketplaceView(initial: InitialState) {
  useKeyboardShortcuts({
    f: () => setTab('feed'),
    s: () => setTab('sales'),
    e: () => setTab('explore'),
  })

  // --- state ---
  const [tab, setTab] = useState<TabName>('feed')
  const [state, setState] = useState<TabPages>(initial)
  const { add: addFresh } = useFresh<TabName>()

  const curr = state[tab]

  const [filters, setFilters] = useState<Record<TabName, Record<string, string[]>>>({
    feed: { status: ['active'] },
    sales: { status: ['expired'] },
    explore: {},
  })

  // --- mutations ---
  const { mergePage, replacePage, addItem } = useTabMutations(setState)

  const addItemAndMarkFresh = useCallback(
    <K extends TabName>(tab: K, item: TabResource[K]) => {
      addItem(tab, item)
      addFresh(tab, item.id)
    },
    [addItem, addFresh]
  )

  // --- ws connect + subs ---
  useEffect(() => {
    connectWs()
  }, [])

  useWsFeed(addItemAndMarkFresh)
  useWsSales(addItemAndMarkFresh)

  // --- pagination ---
  useEffect(() => {
    if (!curr.cursor) return

    // merging pages because page fetching adds to page
    const run = async () => {
      const res = await pageGetters[tab](filters[tab])
      if (!res.ok) return

      mergePage(tab, res.data.items, res.data.cursor)
    }

    run()
  }, [filters, tab, curr.cursor, mergePage])

  // --- filter change ---
  useEffect(() => {
    const run = async () => {
      const res = await pageGetters[tab]({ filters: filters[tab], cursor: null })
      if (!res.ok) return

      replacePage(tab, res.data)
    }

    run()
  }, [tab, filters, replacePage])

  function handleSearch(value: string) {
    const rawParams = new URLSearchParams(value)
    const next: Record<string, string[]> = {}

    for (const [key, raw] of rawParams) {
      const values = raw.split(',')
      const unique = [...new Set(values)]
      next[key] = unique
    }

    setFilters(prev => ({
      ...prev,
      [tab]: next,
    }))
  }

  return (
    <div className="flex gap-4 h-screen max-w-4xl px-2 mx-auto overflow-hidden font-mono">
      {/* ---- main content ---- */}
      <main className="flex-1 flex flex-col mt-4 gap-4">
        <div className="flex items-center">
          <div className="basis-1/4 flex justify-start">
            {/* todo: make nice way to pass chainid in case of later multichain */}
            {/* todo important: change this buggy [0] thing asap very important */}
            <CreateOrderBtn
              chainId={31337}
              collection={'0x1Db6f0B4E780c7eccD9736090627e824E4abe83D'}
            />
          </div>
          <div className="basis-1/2 flex justify-center gap-4 text-accent">
            <button className="menuBtn">[ Swords ]</button>

            <button className="menuBtn">[ Elixirs ]</button>

            <button className="menuBtn">[ Shields ]</button>
          </div>
          <div className="w-1/4 flex justify-end">
            <TxTracker />
          </div>
        </div>

        <div className="flex w-full border-b border-soft">
          {(Object.keys(tabUIConfig) as TabName[]).map(title => (
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
            defaultValue={Object.entries(filters[tab])
              .map(([k, v]) => `${k}=${v}`)
              .join('&')}
            onSubmit={handleSearch}
          />
          <Tabs
            feed={state.feed.items}
            sales={state.sales.items}
            explore={state.explore.items}
            activeTab={tab}
          />
        </div>
      </main>
    </div>
  )
}
