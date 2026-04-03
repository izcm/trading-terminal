import { Spinner } from '@/ui/atoms/Spinner'
import { TxTracker } from '../../realtime/ui/TxTracker'
import { WalletWidget } from '../../wallet/ui/WalletWidget'
import { Backpack } from 'ui/icons'

type InventoryInfo = {
  count: number
  isLoading: boolean
}

type HeaderProps = {
  chainId: number | undefined
  inventory: InventoryInfo
  onOpenManual: () => void
}

export function Header({ chainId, inventory, onOpenManual }: HeaderProps) {
  return (
    <div className="flex items-center mb-1">
      <div className="basis-1/3 flex items-center justify-start gap-4">
        <WalletWidget />
        <span className="text-sm text-accent">chainId: {chainId}</span>
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

        <TxTracker />
      </div>
    </div>
  )
}
