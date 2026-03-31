import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function useWallet() {
  const { address, status, chainId } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return {
    account: address,
    isConnected: status === 'connected',
    connect: () => connectAsync({ connector: connectors[0] }),
    disconnect,
    chainId,
  }
}
