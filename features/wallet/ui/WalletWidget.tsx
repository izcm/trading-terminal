import { ConnectButton } from '@rainbow-me/rainbowkit'

type WalletWidgetProps = {
  className?: string
}

export function WalletWidget({ className }: WalletWidgetProps) {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal, openAccountModal, mounted }) => {
        if (!mounted) return null

        const open = () => {
          if (!account) openConnectModal()
          else openAccountModal()
        }

        return (
          <button onClick={open} className={`btn btn-menu ${className ?? ''}`}>
            {account ? account.displayName : 'Connect wallet'}
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
