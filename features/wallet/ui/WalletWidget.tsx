import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WalletWidget() {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal, openAccountModal, mounted }) => {
        if (!mounted) return null

        if (!account) {
          return (
            <button className="btn btn-menu" onClick={openConnectModal}>
              Connect wallet
            </button>
          )
        }

        return (
          <button className="btn btn-menu" onClick={openAccountModal}>
            {account.displayName}
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
