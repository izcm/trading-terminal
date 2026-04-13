'use client'
import dynamic from 'next/dynamic'

import type { Tx } from '@/app/providers/TxProvider'

import type { Hex } from '@/domain/shared/eth'
import { truncateHex } from '@/domain/shared/utils/fmt/hex'

import { Backpack, Settings } from '@/ui/icons'
import { Spinner, Copyable } from '@/ui/atoms'
import { Popover } from '@/ui/molecules'

import { TxTracker } from '../../realtime/ui/TxTracker'

const WalletWidget = dynamic(
  () => import('../../wallet/ui/WalletWidget').then(m => m.WalletWidget),
  { ssr: false }
)

type InventoryInfo = {
  count: number
  isLoading: boolean
}

type HeaderProps = {
  chainId: number | undefined
  inventory: InventoryInfo
  contractAddress: Hex | undefined
  collection: Hex
  onOpenManual: () => void
  onNavigateToTx: (tx: Tx) => void
}

export function Header({
  chainId,
  inventory,
  contractAddress,
  collection,
  onOpenManual,
  onNavigateToTx,
}: HeaderProps) {
  return (
    <div className="flex items-center mb-1">
      <div className="basis-1/3 flex items-center justify-start gap-4 text-sm">
        <WalletWidget />
        {chainId ? (
          <Popover
            align="left"
            trigger={
              <button className="text-sm text-accent cursor-pointer border border-transparent hover:border-accent/40 px-1 rounded transition-colors">
                [ chainId: {chainId} ]
              </button>
            }
          >
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 justify-between">
                <span className="text-muted">dmrkt engine</span>
                {contractAddress ? (
                  <Copyable value={contractAddress}>{truncateHex(contractAddress)}</Copyable>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
              <div className="flex gap-4 justify-between">
                <span className="text-muted">collection</span>
                <Copyable value={collection}>{truncateHex(collection)}</Copyable>
              </div>
            </div>
          </Popover>
        ) : (
          <span className="text-failure">Not connected</span>
        )}
      </div>

      <div className="basis-1/3 flex justify-center">
        <button onClick={onOpenManual} className="btn btn-menu w-full max-w-[250px]">
          dmrkt manual
        </button>
      </div>

      <div className="basis-1/3 flex items-center justify-end gap-4">
        <button className="btn btn-menu">
          <Settings size={16} />
        </button>

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
    </div>
  )
}
