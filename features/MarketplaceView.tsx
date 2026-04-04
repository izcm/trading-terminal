'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Hex } from '@/domain/shared/eth'

import { connectWs } from '@/lib/realtime/ws'
import type { Page } from '@/lib/utils/http'

// shared components
import { SalesReceipt } from '../ui/organisms/SalesReceipt'
import { Modal, TextInput } from '@/ui/atoms'

// tab config
import { pageGetters, TabResource, tabUIConfig, type TabName } from './tab-config'
import { TabContainer } from './TabContainer'

// feature hooks
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts'
import { useTabMutations } from './hooks/use-tab-mutations'

import { useWsFeed, useWsSales } from './realtime/hooks/use-ws-sub'

import {
  useSearchFilters,
  useFresh,
  useMainAction,
  useTabActions,
  useMine,
  useOwnedTokenIds,
} from './marketplace/hooks'

import { useWallet } from './wallet/hooks/use-wallet'

// feature UI
import { Header } from './marketplace/ui/Header'
import { CreateOrderFlow } from './orders/ui/CreateOrderModal'
import { Manual } from './marketplace/ui/Manual'
import { buildSearchDefault } from './marketplace/lib/build-search-default'
import { Tabs } from './marketplace/ui/Tabs'

type InitialState = {
  [K in TabName]: Page<TabResource[K]>
} & {
  chainId: number
  collection: Hex
}

type TabPages = {
  [K in TabName]: Page<TabResource[K]>
}

export function MarketplaceView(initial: InitialState) {
  // --- route params ---
  const { collection: routeCollection, chainId: routeChainId } = initial

  // --- state ---
  const [tab, setTab] = useState<TabName>('feed')
  const [state, setState] = useState<TabPages>(initial)

  // --- selected item ---
  const [selectedByTab, setSelectedByTab] = useState<Partial<{ [K in TabName]: string }>>({})

  const selectedItem = state[tab].items.find(i => i.id === selectedByTab[tab])

  // --- wallet stuff ---
  const { account, isConnected, connect, disconnect, chainId } = useWallet()
  const walletInteraction = () => (isConnected ? disconnect() : connect())

  // --- display manual ---
  const [showManual, setShowManual] = useState<boolean>()

  // --- user owned nfts + selected context (is owned token) ---
  const {
    ids: ownedIds,
    isFetching: loadingInventory,
    refetch: fetchOwnedIds,
  } = useOwnedTokenIds(routeCollection, account)

  const { isMyToken, isMyListing, buildMineQuery } = useMine(
    tab,
    account,
    routeCollection,
    ownedIds
  )

  // --- filters ---
  const { filters, mineFlag, handleSearch } = useSearchFilters(tab, account)

  // --- mutations ---
  const { add: addFresh } = useFresh<TabName>()
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
  const resolvedTabAction = useMainAction(
    tab,
    selectedItem,
    { isMyToken, isMyListing },
    tabActions,
    { refetch: fetchOwnedIds }
  )

  // tab gallery focus (centralizing keyboard shortcuts)
  const focusGalleryRef = useRef<() => void>(() => {})

  // --- keyboard shortcuts ---
  useKeyboardShortcuts({
    // tab switch
    f: () => setTab('feed'),
    s: () => setTab('sales'),
    e: () => setTab('explore'),

    // header shortcuts
    W: () => walletInteraction(),
    m: () => setShowManual(true),

    // tab internals
    a: () => {
      if (!resolvedTabAction?.run || resolvedTabAction.disabled || resolvedTabAction.loading) return
      resolvedTabAction.run()
    },
    g: () => focusGalleryRef.current?.(),
  })

  // --- ws ---
  useEffect(() => {
    connectWs()
  }, [])

  useWsFeed({ addItem: addItemAndMarkFresh, updateItem })
  useWsSales({ addItem: addItemAndMarkFresh, updateItem })

  // --- query ---
  const query = useMemo(() => {
    const base = filters[tab]

    const activeFilters = {
      ...base,
      chainId: [routeChainId.toString()],
      collection: [routeCollection],
    } satisfies Record<string, string[]>

    return mineFlag[tab] ? buildMineQuery(activeFilters) : activeFilters
  }, [tab, filters, mineFlag, routeChainId, routeCollection, buildMineQuery])

  // --- pagination ---
  // todo: actually implement pagination (infinite scroll style)
  const currCursor = state[tab].cursor

  // useEffect(() => {
  //   if (!currCursor) return

  //   const run = async () => {
  //     const res = await pageGetters[tab]({ filters: query, cursor: currCursor })
  //     if (!res.ok) return
  //     mergePage(tab, res.data.items, res.data.cursor)
  //   }

  //   run()
  // }, [tab, currCursor, mergePage])

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

        <Header
          chainId={chainId}
          onOpenManual={() => setShowManual(true)}
          inventory={{ count: ownedIds.length, isLoading: loadingInventory }}
        />

        {/* ---- tabs ---- */}

        <Tabs value={tab} onChange={setTab} items={Object.keys(tabUIConfig) as TabName[]} />

        {/* ---- content ---- */}

        <div className="min-h-0 flex-1 flex-col flex gap-4">
          <TextInput
            key={tab}
            defaultValue={buildSearchDefault({
              activeFilters: filters[tab],
              account,
              isMine: mineFlag[tab],
            })}
            onSubmit={handleSearch}
          />

          <TabContainer
            ui={tabUIConfig[tab]}
            items={state[tab].items}
            selectedId={selectedByTab[tab]}
            setSelectedId={id => setSelectedByTab(prev => ({ ...prev, [tab]: id }))}
            focusGalleryRef={focusGalleryRef}
            tabAction={resolvedTabAction}
            ctx={{ isMyListing, isMyToken }}
          />
        </div>
      </main>

      {modal?.type === 'receipt' && (
        <Modal isOpen onClose={closeModal}>
          <SalesReceipt sale={modal.data} />
        </Modal>
      )}

      {modal?.type === 'createOrder' && (
        <Modal isOpen onClose={closeModal}>
          <CreateOrderFlow
            collection={modal.data.collection}
            tokenId={modal.data.tokenId}
            side={modal.data.side}
          />
        </Modal>
      )}

      {showManual && (
        <Modal isOpen onClose={() => setShowManual(false)}>
          <Manual />
        </Modal>
      )}
    </div>
  )
}
