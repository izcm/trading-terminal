import type { Address } from 'viem'
import { erc721Abi } from 'viem'

import { getPublicClient } from 'wagmi/actions'
import { config } from '../config/wagmi'

import type { NFT } from '@/domain/nft'
import type { Paginated, Result } from '@/lib/utils/http'

// only works with sequential tokenIds
export async function readNFTBatch(
  address: Address,
  limit: number,
  cursor: number = 0
): Promise<Result<Paginated<NFT>>> {
  const client = getPublicClient(config, { chainId: 31337 })

  const calls = Array.from({ length: limit }, (_, tokenId) =>
    client.readContract({
      address,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [BigInt(tokenId + cursor)],
    })
  )

  try {
    const result = await Promise.all(calls)

    return {
      ok: true,
      data: {
        items: result.map((tokenURI, tokenId) => ({
          id: `${31337}:${address}:${tokenId}`,
          tokenId: (tokenId + cursor).toString(),
          tokenURI,
        })),
        nextCursor: null, // todo: make this less clumsy
      },
    }
  } catch (err) {
    return { ok: false, error: `error reading items: ${err}` }
  }
}
