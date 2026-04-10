'use client'
import dynamic from 'next/dynamic'

import { Backpack } from '@/ui/icons'
import { Spinner } from '@/ui/atoms/Spinner'
import type { Tx } from '@/app/providers/TxProvider'
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
  onOpenManual: () => void
  onNavigateToTx: (tx: Tx) => void
}

export function Header({ chainId, inventory, onOpenManual, onNavigateToTx }: HeaderProps) {
  return (
    <div className="flex items-center mb-1">
      <div className="basis-1/3 flex items-center justify-start gap-4">
        <WalletWidget />
        {chainId ? (
          <span className="text-sm text-accent">chainId: {chainId}</span>
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
        <div className="flex gap-2 text-sm text-accent">
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
