import { erc721Abi as abi, Hex } from 'viem'
import { useReadContract } from 'wagmi'

type QueryKey = {
  chainId: number
  address: Hex
  tokenId: bigint
}

export function useTokenURI({ chainId, address, tokenId }: QueryKey) {
  return useReadContract({
    abi,
    address,
    functionName: 'tokenURI',
    args: [tokenId],
    chainId,
    query: {
      staleTime: Infinity,
    },
  })
}
