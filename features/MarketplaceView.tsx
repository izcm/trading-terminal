'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { toSearchParams } from '@/lib/dmrkt-indexer/actions/logic/param-mapper'
import { connectWs } from '@/lib/realtime/ws'
import type { Page } from '@/lib/utils/http'

// shared components
import { Modal, TextInput } from '@/ui/atoms'

// hooks
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts'
import { useTabMutations } from './hooks/use-tab-mutations'
import { useWsFeed, useWsSales } from './realtime/hooks/use-ws-sub'
import { useSearchFilters } from './marketplace/hooks/use-search-filters'
import { useFresh } from './marketplace/hooks/use-fresh'

// tab config
import { pageGetters, TabResource, tabUIConfig, type TabName } from './tab-config'
import { TabContainer } from './TabContainer'

// features
import { TxTracker } from './realtime/ui/TxTracker'
import { useMine } from './marketplace/hooks/use-mine'
import { useWallet } from './wallet/hooks/use-wallet'
import { WalletWidget } from './wallet/ui/WalletWidget'
import { useTabActions } from './marketplace/hooks/use-tab-actions'
import { Receipt } from './marketplace/ui/ReceiptBtn'

type InitialState = {
  [K in TabName]: Page<TabResource[K]>
}

type TabPages = {
  [K in TabName]: Page<TabResource[K]>
}

export function MarketplaceView(initial: InitialState) {
  // --- state ---
  const [tab, setTab] = useState<TabName>('feed')
  const [state, setState] = useState<TabPages>(initial)

  // --- selected item per tab ---
  const [selectedByTab, setSelectedByTab] = useState<Partial<{ [K in TabName]: string }>>({})
  const selectedItem = state[tab].items.find(i => i.id === selectedByTab[tab])

  const { account, isConnected, connect, disconnect, chainId } = useWallet()
  const { add: addFresh } = useFresh<TabName>()

  const walletInteraction = () => (isConnected ? disconnect() : connect())

  // main section of page (added so marketplaceview controls all shortcuts)
  const focusActiveTabRef = useRef<() => void>(() => {})

  // --- shortcuts ---
  useKeyboardShortcuts({
    // tab switch
    f: () => setTab('feed'),
    s: () => setTab('sales'),
    e: () => setTab('explore'),
    W: () => walletInteraction(),

    // tab internals
    // a: () => {
    //   actionRef.current?.querySelector('button')?.click()
    // },
    g: () => focusActiveTabRef.current?.(),
  })

  // --- collection ---
  const activeCollection = selectedItem ? selectedItem.collection : undefined

  // --- filters ---
  const { filters, mineFlag, handleSearch } = useSearchFilters(tab, account)

  // --- mine ---
  const { isMyToken, isMyListing, buildMineQuery } = useMine(tab, account, activeCollection)

  // --- mutations ---
  const { mergePage, replacePage, addItem, updateItem } = useTabMutations(setState)

  const addItemAndMarkFresh = useCallback(
    <K extends TabName>(tab: K, item: TabResource[K]) => {
      addItem(tab, item)
      addFresh(tab, item.id)
    },
    [addItem, addFresh]
  )

  // --- tab main actions ---
  const { actions: tabActions, modal, closeModal } = useTabActions()

  // --- ws ---
  useEffect(() => {
    connectWs()
  }, [])

  useWsFeed({ addItem: addItemAndMarkFresh, updateItem })
  useWsSales({ addItem: addItemAndMarkFresh })

  // --- query ---
  const query = useMemo(() => {
    const activeFilters = filters[tab]
    return mineFlag[tab] ? buildMineQuery(activeFilters) : activeFilters
  }, [tab, filters, mineFlag, buildMineQuery])

  // --- pagination ---
  const currCursor = state[tab].cursor

  useEffect(() => {
    if (!currCursor) return

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
      <main className="flex-1 flex flex-col gap-4 mt-4">
        {/* ---- header ---- */}

        <div className="flex items-center mb-1">
          <div className="basis-1/3 items-center flex justify-start">
            <WalletWidget />
            <span className="px-2 text-sm text-accent-weak">chainId: {chainId}</span>
          </div>

          <div className="basis-1/3 flex justify-center">
            <button className="btn btn-menu w-full max-w-[250px]">dmrkt manual</button>
          </div>

          <div className="basis-1/3 flex justify-end">
            <TxTracker />
          </div>
        </div>

        {/* ---- tabs ---- */}

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

        {/* ---- content ---- */}

        <div className="min-h-0 flex-1 flex-col flex gap-4">
          <TextInput
            key={tab}
            defaultValue={(() => {
              const base = decodeURIComponent(toSearchParams(filters[tab]).toString())
              return mineFlag[tab] ? `mine ${base}` : base
            })()}
            onSubmit={handleSearch}
          />

          <TabContainer
            ui={tabUIConfig[tab]}
            items={state[tab].items}
            selectedId={selectedByTab[tab]}
            setSelectedId={id => setSelectedByTab(prev => ({ ...prev, [tab]: id }))}
            focusActiveTabRef={focusActiveTabRef}
            mainAction={tabActions[tab]}
            ctx={{ isMyToken, isMyListing }}
          />
        </div>
      </main>
      {modal?.type === 'receipt' && (
        <Modal isOpen onClose={closeModal}>
          <Receipt sale={modal.data} />
        </Modal>
      )}
    </div>
  )
}
