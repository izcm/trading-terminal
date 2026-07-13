import { usePublicClient as useWagmiPublicClient } from 'wagmi'

export function usePublicClient(parameters?: { chainId?: number }) {
  return useWagmiPublicClient(parameters)
}
