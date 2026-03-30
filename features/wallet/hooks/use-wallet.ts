import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function useWallet() {
  const { address, status } = useAccount()
  const { connectAsync } = useConnect()
  const { disconnect } = useDisconnect()

  return {
    account: address,
    isConnected: status === 'connected',
    connect: connectAsync,
    disconnect,
  }
}
