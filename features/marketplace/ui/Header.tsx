'use client'
import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

import type { Tx } from '@/app/providers/TxProvider'

import type { Hex } from '@/domain/shared/eth'

import { truncateHex } from '@/lib/utils/hex'
import { getChainConfig } from '@/lib/blockchain'

import { useWallet } from '@/features/wallet/hooks/use-wallet'

import { Backpack, Menu, Settings } from '@/ui/icons'
import { Spinner, Copyable } from '@/ui/atoms'
import { Popover } from '@/ui/molecules'

import { TxTracker } from '../../realtime/ui/TxTracker'
import { cn } from '@/lib/utils/cn'

const WalletWidget = dynamic(
  () => import('../../wallet/ui/WalletWidget').then(m => m.WalletWidget),
  { ssr: false }
)

type InventoryInfo = {
  count: number
  isLoading: boolean
}

type HeaderProps = {
  chainId: number
  collection: Hex
  inventory: InventoryInfo
  onOpenManual: () => void
  onOpenSettings: () => void
  onNavigateToTx: (tx: Tx) => void
}

/**
 * Layout: a 3-column grid — [wallet] [manual / hamburger] [settings + status].
 *   Mobile-first: all three columns are equal (1fr) until `md`, where the
 *   middle column shrinks to `auto` (fits the "dmrkt manual" button) and the
 *   outer two columns split whatever's left.
 *
 * Breakpoint strategy:
 *   `lg`  — the real point where mobile collapses into one menu. Below `lg`,
 *           the middle column shows a hamburger (<MobileMenu>) instead of the
 *           "dmrkt manual" button, and settings/status also fold into it.
 *   `md`  — a secondary threshold used only to progressively reveal a couple
 *           of extra details (chain badge, inventory count) once there's
 *           enough room, even though the layout is still in "mobile" mode.
 *
 * Wallet state drives two conditional areas:
 *   Chain badge (left) — only shown when connected.
 *     Wrong chain → display-only badge showing wallet's current chainId.
 *     Correct chain → clickable badge, opens contract address popover.
 *   Status area (right) — settings always visible, then:
 *     Not connected → "not connected" error.
 *     Wrong chain   → "wrong chainId" error.
 *     Happy path    → inventory count + tx tracker.
 */
type HeaderMobileStatusProps = {
  chainId: number
  isConnected: boolean
  wrongChainId: boolean
  isResolving: boolean
}

/** Wallet-status banner for below `md`, where the rest of <Header> is hidden. */
export function HeaderMobileStatus({
  chainId,
  isConnected,
  wrongChainId,
  isResolving,
}: HeaderMobileStatusProps) {
  return (
    <>
      {!isConnected && (
        <div className="md:hidden -mx-4 mb-1 bg-failure/10 py-1.5 text-center text-failure text-sm">
          no wallet connected
        </div>
      )}
      {isConnected && wrongChainId && !isResolving && (
        <div className="md:hidden -mx-4 mb-1 bg-failure/10 py-1.5 text-center text-failure text-sm">
          wrong chainId - switch to {chainId}
        </div>
      )}
    </>
  )
}

export function Header({
  inventory,
  collection,
  chainId,
  onOpenManual,
  onOpenSettings,
  onNavigateToTx,
}: HeaderProps) {
  const { chainId: walletChainId, isConnected, isResolving } = useWallet()

  const wrongChainId = chainId !== walletChainId

  const chain = !wrongChainId ? getChainConfig(walletChainId) : undefined

  return (
    <>
      <HeaderMobileStatus
        chainId={chainId}
        isConnected={isConnected}
        wrongChainId={wrongChainId}
        isResolving={isResolving}
      />

      <div className="hidden md:grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1fr_auto_1fr] items-center mb-1 gap-4 sm:[&>*>button.btn-menu]:h-6">
        <div className="hidden md:block">
          <WalletSection
            isConnected={isConnected}
            wrongChainId={wrongChainId}
            walletChainId={walletChainId}
            chainId={chainId}
            collection={collection}
            chain={chain}
          />
        </div>

        {/* dmrkt manual — visible at lg and above */}
        <div className="hidden lg:flex">
          <button onClick={onOpenManual} className="btn btn-menu px-12">
            dmrkt manual
          </button>
        </div>

        {/* lg and below: manual and settings collapse into this menu (wallet/status join below md too — see MobileMenu). TxTracker always renders separately in StatusSection, at every width. */}
        <div className="lg:hidden col-start-2 w-full">
          <MobileMenu
            onOpenManual={onOpenManual}
            onOpenSettings={onOpenSettings}
            contentClassNames="[&>*>button.btn-menu]:h-8"
            triggerBtn={
              <button className="btn btn-menu px-6 h-6">
                <Menu size={16} />
              </button>
            }
          />
        </div>

        {/* settings + wallet status OR inventory + session txs */}
        <div className="flex items-center justify-between gap-4 justify-between">
          <button className="hidden lg:inline-flex btn btn-menu" onClick={onOpenSettings}>
            <Settings size={16} />
          </button>

          <StatusSection
            onNavigateToTx={onNavigateToTx}
            isConnected={isConnected}
            wrongChainId={wrongChainId}
            isResolving={isResolving}
            chainId={chainId}
            inventory={inventory}
          />
        </div>
      </div>
    </>
  )
}

type WalletSectionProps = {
  isConnected: boolean
  wrongChainId: boolean
  walletChainId: number | undefined
  chainId: number
  collection: Hex
  chain: ReturnType<typeof getChainConfig> | undefined
}

function WalletSection({
  isConnected,
  wrongChainId,
  walletChainId,
  chainId,
  collection,
  chain,
}: WalletSectionProps) {
  return (
    <div className="flex items-center justify-start gap-4 text-sm">
      <WalletWidget className="h-6" />

      {isConnected && wrongChainId && (
        <span className="text-accent">[ chainId: {walletChainId} ]</span>
      )}

      {isConnected && !wrongChainId && (
        <Popover
          align="left"
          trigger={
            <button className="text-accent cursor-pointer border border-transparent hover:border-accent/40 px-1 rounded transition-colors">
              [ chainId: {chainId} ]
            </button>
          }
        >
          {/* contract addresses */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 justify-between">
              <span className="text-subtle">dmrkt engine</span>
              {chain?.marketplace ? (
                <Copyable value={chain.marketplace}>{truncateHex(chain.marketplace)}</Copyable>
              ) : (
                <span className="text-muted">—</span>
              )}
            </div>
            <div className="flex gap-4 justify-between">
              <span className="text-subtle">collection</span>
              <Copyable value={collection}>{truncateHex(collection)}</Copyable>
            </div>
          </div>
        </Popover>
      )}
    </div>
  )
}

type MobileMenuProps = {
  onOpenManual: () => void
  onOpenSettings: () => void
  contentClassNames?: string
  triggerBtn: ReactNode
}

export function MobileMenu({
  onOpenManual,
  onOpenSettings,
  triggerBtn,
  contentClassNames,
}: MobileMenuProps) {
  return (
    <Popover
      contentClassName={cn('fixed inset-x-4 top-16 rounded-lg z-50 p-4', contentClassNames)}
      trigger={triggerBtn}
    >
      <div className="flex flex-col gap-2 [&>button]:text-base">
        <WalletWidget className="md:hidden" />

        <button onClick={onOpenManual} className="btn btn-menu">
          Manual
        </button>

        <button className="btn btn-menu flex items-center gap-2" onClick={onOpenSettings}>
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </Popover>
  )
}

type StatusSectionProps = {
  onNavigateToTx: (tx: Tx) => void
  isConnected: boolean
  wrongChainId: boolean
  isResolving: boolean
  chainId: number
  inventory: InventoryInfo
}

function StatusSection({
  onNavigateToTx,
  isConnected,
  wrongChainId,
  isResolving,
  chainId,
  inventory,
}: StatusSectionProps) {
  return (
    <div className="flex flex-1 items-center justify-end gap-4">
      <div className="flex justify-end">
        {!isConnected ? (
          <span className="text-failure text-sm">no wallet connected</span>
        ) : wrongChainId && !isResolving ? (
          <span className="text-failure text-sm">wrong chainId - switch to {chainId}</span>
        ) : (
          // hide inventory for md screens and below
          <div className="flex items-center justify-center gap-2 text-accent text-sm">
            {inventory.isLoading ? (
              <>
                <Spinner size={16} />
                <span>inventory...</span>
              </>
            ) : (
              <>
                <Backpack size={16} />
                <span>{inventory.count}</span>
              </>
            )}
          </div>
        )}
      </div>

      {isConnected && !wrongChainId && !isResolving && (
        <TxTracker onNavigateToTx={onNavigateToTx} />
      )}
    </div>
  )
}
