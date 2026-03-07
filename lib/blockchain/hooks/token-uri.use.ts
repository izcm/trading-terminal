import type { Hex } from '@/domain/shared/eth'
import { erc721Abi as abi } from 'viem'
import { useReadContract } from 'wagmi'

type QueryKey = {
  chainId: number
  address: Hex
  tokenId: bigint
}

export function useTokenURI(params?: QueryKey) {
  const enabled = params !== undefined

  return useReadContract({
    abi,
    address: params?.address,
    functionName: 'tokenURI',
    args: enabled ? [params!.tokenId] : undefined,
    chainId: params?.chainId,
    query: {
      enabled,
      staleTime: Infinity,
    },
  })
}
