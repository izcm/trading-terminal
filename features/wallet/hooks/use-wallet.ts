import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'

export function useWallet() {
  const { address, status, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()

  return {
    account: address,
    isConnected: status === 'connected',
    isResolving: status === 'connecting' || status === 'reconnecting',
    connect: () => openConnectModal?.(),
    disconnect,
    chainId,
  }
}
