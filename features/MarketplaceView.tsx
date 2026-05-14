'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Page } from '@/lib/utils/http'
import { type Tx, useTx } from '@/app/providers/TxProvider'

// shared components
import { SalesReceipt } from '@/ui/organisms'
import { SettingsMenu } from '@/ui/organisms'
import { Modal, TextInput } from '@/ui/atoms'

// tab config
import { TabResource, tabUIConfig, type TabName } from './tab-config'
import { TabContainer } from './TabContainer'

// feature hooks
import { useKeyboardShortcuts } from '../lib/hooks/use-keyboard-shortcuts'
import { useWallet } from './wallet/hooks/use-wallet'
import {
  useSearchFilters,
  useMainAction,
  useTabActions,
  useMine,
  useOwnedTokenIds,
} from './marketplace/hooks'
import { useMarketplaceData } from './marketplace/hooks/data/use-marketplace-data'

// feature UI
import { CreateOrderFlow } from './orders/ui/CreateOrderFlow'
import { Header } from './marketplace/ui/Header'
import { Manual } from './marketplace/ui/Manual'
import { Tabs } from './marketplace/ui/Tabs'
import { buildSearchDefault } from './marketplace/lib/build-search-default'
import { CollectionProvider } from './collection/CollectionContext'

import type { NFTCollection } from '@/domain/nft-collection'

type InitialState = {
  [K in TabName]: Page<TabResource[K]>
} & {
  collection: NFTCollection
}

type InfoModalType = 'manual' | 'settings'

type InfoModalState = { open: true; type: InfoModalType } | { open: false }

export function MarketplaceView(initial: InitialState) {
  // --- route params ---
  const { collection } = initial
  const { address: collectionAddress, chainId } = collection

  // --- wallet ---
  const { account, isConnected, connect, disconnect, chainId: walletChainId } = useWallet()
  const { showTxs } = useTx()
  const walletInteraction = () => (isConnected ? disconnect() : connect())

  // --- state ---
  const [tab, setTab] = useState<TabName>('feed')
  const [selectedByTab, setSelectedByTab] = useState<Partial<{ [K in TabName]: string }>>({})
  const [resetTick, setResetTick] = useState(0)

  const [infoModal, setInfoModal] = useState<InfoModalState>({
    open: false,
  })
  const [manualTab, setManualTab] = useState<'shortcuts' | 'filters' | 'examples'>('shortcuts')

  const infoModalContent = {
    manual: <Manual initialTab={manualTab} />,
    settings: <SettingsMenu />,
  }

  // --- filters ---
  const { filters, setFilters, mineFlag, handleSearch, resetFilters, resetMineFlag } =
    useSearchFilters(tab, account)

  // --- ownership ---
  const {
    ids: ownedIds,
    isFetching: loadingInventory,
    refetch: refetchOwnedIds,
  } = useOwnedTokenIds(collectionAddress, account)

  const { isMine, isMyListing, buildMineQuery } = useMine(tab, account, ownedIds)

  // --- data ---
  const tabRef = useRef(tab)

  const handlePageReplaced = useCallback(
    <K extends TabName>(tab: K, data: Page<TabResource[K]>) => {
      const tabChanged = tabRef.current !== tab
      tabRef.current = tab

      if (tabChanged) return

      setSelectedByTab(prev => ({
        ...prev,
        [tab]: data.items[0]?.id,
      }))
    },
    []
  )

  const { state, isFresh, isLoadingMore, loadMore } = useMarketplaceData(
    tab,
    filters,
    mineFlag,
    chainId,
    collectionAddress,
    isMine,
    buildMineQuery,
    handlePageReplaced
  )

  const selectedItem = useMemo(
    () => state[tab].items.find(i => i.id === selectedByTab[tab]),
    [state, tab, selectedByTab]
  )

  // --- tab actions ---
  const { actions: tabActions, modal: actionModal, closeModal } = useTabActions()
  const mainAction = useMainAction(tab, selectedItem, { isMine, isMyListing }, tabActions, {
    refetch: refetchOwnedIds,
  })

  const wrongChain = isConnected && walletChainId !== chainId
  const resolvedMainAction =
    wrongChain && tab !== 'sales' ? { run: undefined, loading: false, disabled: true } : mainAction

  // --- navigation helpers ---
  function resetFiltersAndSelected(tab: TabName) {
    setTab(tab)
    resetFilters(tab)
    resetMineFlag(tab)
    setResetTick(t => t + 1)
  }

  // when user clicks a tx in txTracker => navigate to sales receipt / order row
  function onNavigateToTx(tx: Tx) {
    const tab = tx.label === 'order filled' ? 'sales' : 'feed'

    setTab(tab)
    resetMineFlag(tab)
    setFilters(prev => ({ ...prev, [tab]: { txHash: [tx.hash] } }))
    setResetTick(t => t + 1)
  }

  // --- search input default value ---

  // this state is only to track reset of search value
  const [inputSeed, setInputSeed] = useState('')

  // avoid jumpy input: only react to tab/account,
  // but read latest filters via refs
  const filtersRef = useRef(filters)
  const mineFlagRef = useRef(mineFlag)

  useEffect(() => {
    filtersRef.current = filters
  }, [filters])
  useEffect(() => {
    mineFlagRef.current = mineFlag
  }, [mineFlag])

  useEffect(() => {
    setInputSeed(
      buildSearchDefault({
        activeFilters: filtersRef.current[tab],
        account,
        isMine: mineFlagRef.current[tab],
      })
    )
  }, [tab, account, resetTick])

  // --- ui focus refs ---
  const focusGalleryRef = useRef<() => void>(() => {})
  const searchRef = useRef<HTMLInputElement>(null)

  // --- keyboard shortcuts ---
  const openManual = (tab: 'shortcuts' | 'filters' | 'examples') => {
    setManualTab(tab)
    setInfoModal({ open: true, type: 'manual' })
  }

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
    m: () => openManual('shortcuts'),
    '1': () => openManual('shortcuts'),
    '2': () => openManual('filters'),
    '3': () => openManual('examples'),

    '.': () => setInfoModal({ open: true, type: 'settings' }),
    t: () => showTxs(onNavigateToTx), // open provider tx overview

    // tab internals
    a: () => {
      if (!resolvedMainAction?.run || resolvedMainAction.disabled || resolvedMainAction.loading)
        return
      resolvedMainAction.run()
    },
    l: () => focusGalleryRef.current?.(),
    i: () => searchRef.current?.focus(),
  })

  const view = (
    <div className="flex gap-4 h-screen max-w-4xl px-2 mx-auto overflow-hidden font-mono">
      <main className="flex-1 flex flex-col gap-4 mt-4">
        {/* ---- header ---- */}

        <Header
          chainId={chainId}
          collection={collectionAddress}
          inventory={{ count: ownedIds.length, isLoading: loadingInventory }}
          onOpenManual={() => setInfoModal({ open: true, type: 'manual' })}
          onOpenSettings={() => setInfoModal({ open: true, type: 'settings' })}
          onNavigateToTx={onNavigateToTx}
        />

        {/* ---- tabs ---- */}

        <Tabs value={tab} onChange={setTab} items={Object.keys(tabUIConfig) as TabName[]} />

        {/* ---- search ---- */}

        <TextInput
          key={`${tab}-${resetTick}`}
          ref={searchRef}
          value={inputSeed}
          onSubmit={handleSearch}
        />

        {/* ---- tab gallery + sidepanel ---- */}

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
          tabAction={resolvedMainAction}
          ctx={{ isMine, isMyListing }}
        />
      </main>

      {/* ---- modals ---- */}

      {actionModal?.type === 'receipt' && (
        <Modal isOpen onClose={closeModal}>
          <SalesReceipt sale={actionModal.data} />
        </Modal>
      )}

      {actionModal?.type === 'createOrder' && (
        <Modal isOpen onClose={closeModal} escTxt="Cancel">
          <CreateOrderFlow
            collection={actionModal.data.collection}
            tokenId={actionModal.data.tokenId}
            side={actionModal.data.side}
            onOrderCreated={closeModal}
          />
        </Modal>
      )}

      {infoModal.open && (
        <Modal isOpen onClose={() => setInfoModal({ open: false })}>
          {infoModalContent[infoModal.type]}
        </Modal>
      )}
    </div>
  )

  return <CollectionProvider collection={collection}>{view}</CollectionProvider>
}
