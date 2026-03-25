'use client' // boundry is here!

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { connectWs } from '@/lib/realtime/ws'
import type { Page } from '@/lib/utils/http'

// shared components
import { TextInput } from '@/ui/atoms'

// hooks
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts'
import { useTabMutations } from './hooks/use-tab-mutations'
import { useWsFeed, useWsSales } from './realtime/hooks/use-ws-sub'
import { useSearchFilters } from './marketplace/hooks/use-search-filters'
import { useFresh } from './marketplace/hooks/use-fresh'

// tab config
import { pageGetters, TabResource, tabUIConfig, type TabName } from './tab-config'
import { Tabs } from './Tabs'

// features
import { TxTracker } from './realtime/ui/TxTracker'
import { useMine } from './marketplace/hooks/use-mine'

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

  // --- login ---
  const { address: user } = useAccount()

  // --- state ---
  const [tab, setTab] = useState<TabName>('feed')
  const [state, setState] = useState<TabPages>(initial)
  const { add: addFresh } = useFresh<TabName>()

  // per today marketplace only supports one collection
  const activeCollection = initial.explore.items.length
    ? initial.explore.items[0].collection
    : undefined

  // --- search filters + 'mine' flag ---
  const { filters, mine, handleSearch } = useSearchFilters(tab)

  // --- user inventory ---
  const { isMine, buildMineQuery } = useMine(tab, user, activeCollection)

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

  // --- build query ---
  const query = useMemo(() => {
    const activeFilters = filters[tab]

    return mine[tab]
      ? buildMineQuery(activeFilters) // apply mine filters
      : activeFilters
  }, [tab, filters, mine, buildMineQuery])

  // --- pagination ---
  const currCursor = state[tab].cursor

  useEffect(() => {
    if (!currCursor) return

    // merging pages
    const run = async () => {
      const res = await pageGetters[tab](query ?? {})
      if (!res.ok) return

      mergePage(tab, res.data.items, res.data.cursor)
    }

    run()
  }, [query, tab, currCursor, mergePage])

  // --- filter change ---
  useEffect(() => {
    const run = async () => {
      const res = await pageGetters[tab]({ filters: query, cursor: null })
      if (!res.ok) return

      replacePage(tab, res.data)
    }

    run()
  }, [tab, filters, query, replacePage])

  return (
    <div className="flex gap-4 h-screen max-w-4xl px-2 mx-auto overflow-hidden font-mono">
      {/* ---- main content ---- */}
      <main className="flex-1 flex flex-col mt-4 gap-4">
        <div className="flex items-center">
          <div className="basis-1/4 flex justify-start">
            {/* <CreateAskBtn
              chainId={31337}
              collection={'0x1Db6f0B4E780c7eccD9736090627e824E4abe83D'}
            /> */}
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
            defaultValue={(() => {
              const base = Object.entries(filters[tab])
                .map(([k, v]) => `${k}=${v.join(',')}`)
                .join('&')

              return mine[tab] ? `mine ${base}` : base
            })()}
            onSubmit={handleSearch}
          />
          <Tabs
            feed={state.feed.items}
            sales={state.sales.items}
            explore={state.explore.items}
            activeTab={tab}
            ctx={{ isMine }}
          />
        </div>
      </main>
    </div>
  )
}
