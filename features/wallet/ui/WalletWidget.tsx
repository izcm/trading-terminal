import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WalletWidget() {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal, openAccountModal, mounted }) => {
        if (!mounted) return null

        const open = () => {
          if (!account) openConnectModal()
          else openAccountModal()
        }

        return (
          <button onClick={open} className="btn btn-menu">
            {account ? account.displayName : 'Connect wallet'}
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
