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
import { CreateOrderFlow } from './orders/ui/CreateOrderFlow'
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

  const selectedItem = useMemo(
    () => state[tab].items.find(i => i.id === selectedByTab[tab]),
    [state, tab, selectedByTab]
  )

  // --- wallet stuff ---
  const { account, isConnected, connect, disconnect, chainId } = useWallet()
  const walletInteraction = () => (isConnected ? disconnect() : connect())

  // --- display manual ---
  const [showManual, setShowManual] = useState(false)

  // --- user owned nfts + selected context (is owned token) ---
  const {
    ids: ownedIds,
    isFetching: loadingInventory,
    add: addOwnedId,
    remove: removeOwnedId,
    refetch: refetchOwnedIds,
  } = useOwnedTokenIds(routeCollection, account)

  const { isMyToken, isMyListing, buildMineQuery } = useMine(
    tab,
    account,
    routeCollection,
    ownedIds // hook is responsible to handle stableness
  )

  // --- filters ---
  const { filters, mineFlag, handleSearch, resetFilters } = useSearchFilters(tab, account)

  // --- mutations ---
  const { add: addFresh, has: isFresh } = useFresh<TabName>()
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
    { add: addOwnedId, remove: removeOwnedId, refetch: refetchOwnedIds }
  )

  // ui focus
  const focusGalleryRef = useRef<() => void>(() => {})
  const searchRef = useRef<HTMLInputElement>(null)

  // --- keyboard shortcuts ---
  useKeyboardShortcuts({
    // tab switch
    f: () => setTab('feed'),
    s: () => setTab('sales'),
    e: () => setTab('explore'),

    // tab switch + reset filters
    F: () => {
      resetFiltersAndSelected('feed')
    },
    S: () => {
      resetFiltersAndSelected('sales')
    },
    E: () => {
      resetFiltersAndSelected('explore')
    },

    // header shortcuts
    W: () => walletInteraction(),
    m: () => setShowManual(true),

    // tab internals
    a: () => {
      if (!resolvedTabAction?.run || resolvedTabAction.disabled || resolvedTabAction.loading) return
      resolvedTabAction.run()
    },
    l: () => focusGalleryRef.current?.(),
    i: () => searchRef.current?.focus(),
  })

  const resetFiltersAndSelected = (tab: TabName) => {
    setTab(tab)
    resetFilters(tab)
    setSelectedByTab(prev => ({ ...prev, [tab]: undefined }))
  }

  useEffect(() => {
    // --- ws ---
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
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

  const loadMore = useCallback(async () => {
    const currCursor = state[tab].cursor

    if (!currCursor || isLoadingMore) return

    setIsLoadingMore(true)

    const res = await pageGetters[tab]({
      filters: query,
      cursor: currCursor,
    })

    if (res.ok) {
      mergePage(tab, res.data.items, res.data.cursor)
    }

    setIsLoadingMore(false)
  }, [state, tab, isLoadingMore, query, mergePage])

  // --- filter change ---
  useEffect(() => {
    const run = async () => {
      const res = await pageGetters[tab]({ filters: query, cursor: null })
      if (!res.ok) return
      replacePage(tab, res.data)
    }

    run()
  }, [tab, query, replacePage])

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

        <div className="min-h-0 flex-1 flex-col flex gap-4 fade-in">
          <TextInput
            key={tab}
            ref={searchRef}
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
            isFresh={item => isFresh(tab, item.id)}
            onLoadMore={loadMore}
            isLoading={isLoadingMore}
            hasMore={state[tab].cursor !== null}
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
            onOrderCreated={closeModal}
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
