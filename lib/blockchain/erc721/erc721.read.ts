import type { Address } from 'viem'
import { erc721Abi } from 'viem'

import { getPublicClient } from 'wagmi/actions'
import { config } from '../config/wagmi'

import { parseTokenURI, type NFT } from '@/domain/nft'
import type { Paginated, Result } from '@/lib/utils/http'
import { getImageFromTokenURI } from '@/lib/utils/image'

// only works with sequential tokenIds
export async function readNFTBatch(
  address: Address,
  limit: number,
  cursor: number = 0
): Promise<Result<Paginated<NFT>>> {
  const chainId = 31337 // todo: multichain
  const client = getPublicClient(config, { chainId })

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

    const items = result.map((tokenUri, i) => {
      const tokenId = i + cursor

      const meta = parseTokenURI(tokenUri)

      return {
        id: `${chainId}:${address}:${tokenId}`,
        chainId,
        collection: address,
        tokenId: (tokenId + cursor).toString(),
        ...meta,
      }
    })

    return {
      ok: true,
      data: {
        items,
        nextCursor: null, // todo: make this less clumsy
      },
    }
  } catch (err) {
    return { ok: false, error: `error reading items: ${err}` }
  }
}
