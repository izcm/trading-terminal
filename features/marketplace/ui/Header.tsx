import { TxTracker } from '../../realtime/ui/TxTracker'
import { WalletWidget } from '../../wallet/ui/WalletWidget'

type HeaderProps = {
  chainId: number | undefined
  onOpenManual: () => void
}

export function Header({ chainId, onOpenManual }: HeaderProps) {
  return (
    <div className="flex items-center mb-1">
      <div className="basis-1/3 items-center flex justify-start">
        <WalletWidget />
        <span className="px-2 text-sm text-accent-weak">chainId: {chainId}</span>
      </div>

      <div className="basis-1/3 flex justify-center">
        <button onClick={onOpenManual} className="btn btn-menu w-full max-w-[250px]">
          dmrkt manual
        </button>
      </div>

      <div className="basis-1/3 flex justify-end">
        <TxTracker />
      </div>
    </div>
  )
}
