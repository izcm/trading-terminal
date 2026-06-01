'use client'
import dynamic from 'next/dynamic'

import type { Tx } from '@/app/providers/TxProvider'

import { dmrktDomain } from '@/protocol/eip712/domain'

import type { Hex } from '@/domain/shared/eth'
import { truncateHex } from '@/lib/utils/hex'

import { Backpack, Settings } from '@/ui/icons'
import { Spinner, Copyable } from '@/ui/atoms'
import { Popover } from '@/ui/molecules'

import { TxTracker } from '../../realtime/ui/TxTracker'
import { useWallet } from '@/features/wallet/hooks/use-wallet'

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
 * Wallet state drives two conditional areas:
 *
 * Chain badge (left) — only shown when connected.
 *   Wrong chain → display-only badge showing wallet's current chainId.
 *   Correct chain → clickable badge, opens contract address popover.
 *
 * Status area (right) — settings always visible, then:
 *   Not connected → "not connected" error.
 *   Wrong chain   → "wrong chainId" error.
 *   Happy path    → inventory count + tx tracker.
 */
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

  const dmrktAddress = dmrktDomain.verifyingContract

  return (
    <div className="flex items-center mb-1 gap-4">
      {/* wallet + chain badge */}
      <div className="basis-3/8 flex items-center justify-start gap-4 text-sm">
        <WalletWidget />
        {isConnected &&
          (wrongChainId ? (
            <button className="text-sm text-accent cursor-pointer border border-transparent hover:border-accent/40 px-1 rounded pointer-events-none">
              [ chainId: {walletChainId} ]
            </button>
          ) : (
            <Popover
              align="left"
              trigger={
                <button className="text-sm text-accent cursor-pointer border border-transparent hover:border-accent/40 px-1 rounded transition-colors">
                  [ chainId: {chainId} ]
                </button>
              }
            >
              {/* contract addresses */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 justify-between">
                  <span className="text-subtle">dmrkt engine</span>
                  {dmrktAddress ? (
                    <Copyable value={dmrktAddress}>{truncateHex(dmrktAddress)}</Copyable>
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
          ))}
      </div>

      {/* manual */}
      <div className="basis-2/8 flex justify-center">
        <button onClick={onOpenManual} className="btn btn-menu w-full">
          dmrkt manual
        </button>
      </div>

      {/* settings + wallet status OR inventory + session txs */}
      <div className="basis-3/8 flex items-center justify-between gap-4">
        <button className="btn btn-menu" onClick={onOpenSettings}>
          <Settings size={16} />
        </button>

        {!isConnected ? (
          <span className="text-failure text-sm">no wallet connected</span>
        ) : wrongChainId && !isResolving ? (
          <span className="text-failure text-sm">wrong chainId - switch to {chainId}</span>
        ) : (
          <div className="flex gap-4">
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
            <TxTracker onNavigateToTx={onNavigateToTx} />
          </div>
        )}
      </div>
    </div>
  )
}
