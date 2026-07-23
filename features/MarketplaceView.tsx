'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Page } from '@/lib/utils/http'
import { type Tx, useTx } from '@/app/providers/TxProvider'

// shared components
import { TradeReceipt } from '@/ui/organisms'
import { SettingsMenu } from '@/features/wallet/SettingsMenu'
import { Modal, Spinner, TextInput } from '@/ui/atoms'

import type { NFTCollection } from '@/domain/nft-collection'

// tab config
import { TabResource, tabUIConfig, type TabName } from './tab-config'
import { TabContainer } from './TabContainer'

// feature hooks
import { useKeyboardShortcuts } from '../lib/hooks/use-keyboard-shortcuts'
import { useToastEscape } from '../lib/hooks/use-toast-escape'
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
import { buildSearchDefault } from './marketplace/lib/logic/build-search-default'
import type { TabPages } from './marketplace/hooks/tabs/use-tab-mutations'

// contexts
import { CollectionProvider } from './CollectionContext'
import { StartMessage } from '@/ui/organisms/StartMessage'

// --- initial state ---
type Props = {
  collection: NFTCollection
  initialPages?: TabPages
}

// --- modal ---
type InfoModalType = 'manual' | 'settings' | 'welcomeMsg'

type InfoModalState = { open: true; type: InfoModalType } | { open: false }

export function MarketplaceView({ collection, initialPages }: Props) {
  useToastEscape()

  // --- collection ---
  const { address: collectionAddress, chainId } = collection

  // --- wallet ---
  const { account, isConnected, connect, disconnect, chainId: walletChainId } = useWallet()
  const { showTxs } = useTx()
  const walletInteraction = () => (isConnected ? disconnect() : connect())

  // --- state ---
  const [tab, setTab] = useState<TabName>('orders')
  const [selectedByTab, setSelectedByTab] = useState<Partial<{ [K in TabName]: string }>>({})
  const [resetTick, setResetTick] = useState(0)

  const [infoModal, setInfoModal] = useState<InfoModalState>(() => {
    if (typeof window === 'undefined') return { open: false }

    const hasShownWelcome = localStorage.getItem('hashShownWelcome')
    if (hasShownWelcome) return { open: false }

    localStorage.setItem('hashShownWelcome', 'true')
    return { open: true, type: 'welcomeMsg' }
  })

  const [manualTab, setManualTab] = useState<'shortcuts' | 'filters' | 'examples'>('shortcuts')

  const infoModalContent: Record<
    InfoModalType,
    { content: React.ReactNode; managesFocus: boolean }
  > = {
    manual: { content: <Manual initialTab={manualTab} />, managesFocus: false },
    settings: { content: <SettingsMenu />, managesFocus: true },
    welcomeMsg: { content: <StartMessage />, managesFocus: false },
  }

  // --- filters ---
  const { filters, setFilters, mineFlag, handleSearch, resetFilters, resetMineFlag } =
    useSearchFilters(tab, account)

  // --- ownership ---
  const {
    ids: ownedIds,
    isFetching: loadingInventory,
    refetch: refetchOwnedIds,
  } = useOwnedTokenIds(chainId, collectionAddress, account)

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

  // isReady was added when i wanted tab default filters to include values that were
  // in browser scope -> the inital fetch couldnt happen on the server
  // eg: orders opens with "mine" flag. this depends onowned tokens which cannot be fetched server side
  // since wallet login is browser only
  // feature has been removed in favour of fetching initial items server side
  const isReady = true

  const { state, isFresh, isLoadingMore, loadMore } = useMarketplaceData(
    tab,
    filters,
    mineFlag,
    chainId,
    collectionAddress,
    isMine,
    buildMineQuery,
    handlePageReplaced,
    initialPages,
    isReady
  )

  const selectedItem = useMemo(
    () => state[tab].items.find(i => i.id === selectedByTab[tab]),
    [state, tab, selectedByTab]
  )

  // --- tab actions ---
  const { actions: tabActions, modal: actionModal, closeModal: closeActionModal } = useTabActions()
  const mainAction = useMainAction(tab, selectedItem, { isMine, isMyListing }, tabActions, {
    refetch: refetchOwnedIds,
  })

  const wrongChain = isConnected && walletChainId !== chainId

  const resolvedMainAction =
    // not connected users can still view tx receipts
    (wrongChain || !isConnected) && tab !== 'trades'
      ? { run: undefined, loading: false, disabled: true }
      : mainAction

  // --- navigation helpers ---
  function resetFiltersAndSelected(tab: TabName) {
    setTab(tab)
    resetFilters(tab)
    setResetTick(t => t + 1)
  }

  // when user clicks a tx in txTracker => navigate to trade receipt / order row
  function onNavigateToTx(tx: Tx) {
    const tab = tx.label === 'order filled' ? 'trades' : 'orders'

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

  const modalIsOpen = actionModal !== null || infoModal.open

  useKeyboardShortcuts(
    {
      // tab switch (wasd-style: a = orders, w = nfts, d = trades)
      a: () => setTab('orders'),
      w: () => setTab('nfts'),
      d: () => setTab('trades'),

      // tab switch + reset filters
      A: () => {
        resetFiltersAndSelected('orders')
      },
      W: () => {
        resetFiltersAndSelected('nfts')
      },
      D: () => {
        resetFiltersAndSelected('trades')
      },

      // header shortcuts
      C: () => walletInteraction(),
      '?': () => openManual('shortcuts'),
      '1': () => openManual('shortcuts'),
      '2': () => openManual('filters'),
      '3': () => openManual('examples'),

      ',': () => setInfoModal({ open: true, type: 'settings' }),
      '.': () => showTxs(onNavigateToTx), // open provider tx overview

      o: () => {
        if (!account) return
        setTab('orders')
        setFilters(prev => ({ ...prev, orders: { maker: [account], status: ['active'] } }))
        setResetTick(t => t + 1)
      },

      // tab internals
      i: () => searchRef.current?.focus(),
      Enter: () => {
        if (!resolvedMainAction?.run || resolvedMainAction.disabled || resolvedMainAction.loading)
          return
        resolvedMainAction.run()
      },
      l: () => focusGalleryRef.current?.(),
    },
    { enabled: !modalIsOpen }
  )

  const view = (
    <div className="flex gap-4 h-dvh max-w-[960px] px-2 mx-auto overflow-hidden font-mono">
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

        <div className="hidden md:flex flex-col gap-4">
          {/* ---- tabs ---- */}

          <Tabs value={tab} onChange={setTab} items={Object.keys(tabUIConfig) as TabName[]} />

          {/* ---- search ---- */}

          <TextInput
            key={`${tab}-${resetTick}`}
            ref={searchRef}
            value={inputSeed}
            onSubmit={handleSearch}
          />
        </div>

        {/* ---- tab gallery + sidepanel ---- */}

        {isReady ? (
          <TabContainer
            ui={tabUIConfig[tab]}
            items={state[tab].items}
            selectedId={selectedByTab[tab]}
            setSelectedId={id => setSelectedByTab(prev => ({ ...prev, [tab]: id }))}
            focusGalleryRef={focusGalleryRef}
            isFresh={item => isFresh(tab, item.id)}
            onLoadMore={loadMore}
            isLoading={isLoadingMore}
            hasMore={state[tab].nextCursor !== null}
            tabAction={resolvedMainAction}
            ctx={{ isMine, isMyListing }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size={16} />
          </div>
        )}
      </main>

      {/* ---- modals ---- */}

      {actionModal?.type === 'receipt' && (
        <Modal isOpen onClose={closeActionModal}>
          <TradeReceipt trade={actionModal.data} />
        </Modal>
      )}

      {actionModal?.type === 'createOrder' && (
        <Modal isOpen onClose={closeActionModal} escTxt="Cancel" selfManagesFocus>
          <CreateOrderFlow
            collection={actionModal.data.collection}
            tokenId={actionModal.data.tokenId}
            side={actionModal.data.side}
            onOrderCreated={closeActionModal}
            onOrderNavigate={(id: string) => {
              resetFiltersAndSelected('orders')
              // order id is on fmt {chainId}:{orderHash}
              setFilters(prev => ({ ...prev, ['orders']: { orderHash: [id.split(':')[1]] } }))
            }}
          />
        </Modal>
      )}

      {infoModal.open && (
        <Modal
          isOpen
          onClose={() => setInfoModal({ open: false })}
          selfManagesFocus={infoModalContent[infoModal.type].managesFocus}
        >
          {infoModalContent[infoModal.type].content}
        </Modal>
      )}
    </div>
  )

  return <CollectionProvider collection={collection}>{view}</CollectionProvider>
}
