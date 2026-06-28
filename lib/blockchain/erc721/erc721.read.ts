import { erc721Abi, type Address, type PublicClient } from 'viem'

import type { Result } from '@/lib/utils/http'

import { mapTokenUriToNFT, type NFT } from '@/domain/nft'

export async function readOwned(
  client: PublicClient,
  collection: Address,
  user: Address
): Promise<bigint[]> {
  const tokenIds = Array.from({ length: 500 }, (_, i) => BigInt(i))

  const results = await Promise.all(
    tokenIds.map(async tokenId => {
      try {
        const ownerOf = await client.readContract({
          abi: erc721Abi,
          address: collection,
          functionName: 'ownerOf',
          args: [tokenId],
        })
        return ownerOf.toLowerCase() === user.toLowerCase() ? tokenId : null
      } catch {
        return null
      }
    })
  )

  return results.filter((id): id is bigint => id !== null)
}

export async function readNFT(
  client: PublicClient,
  address: Address,
  tokenId: bigint
): Promise<Result<NFT>> {
  try {
    const tokenUri = await client.readContract({
      address,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [tokenId],
    })

    const chainId = client.chain?.id

    return {
      ok: true,
      data: mapTokenUriToNFT(chainId!, address, tokenId, tokenUri),
    }
  } catch (err) {
    return { ok: false, error: `error reading item: ${err}` }
  }
}
