import { erc721Abi, type Address, type PublicClient } from 'viem'

import type { Result } from '@/lib/utils/http'

import { mapTokenUriToNFT, type NFT } from '@/domain/nft'

export async function readOwned(
  client: PublicClient,
  collection: Address,
  user: Address
): Promise<bigint[]> {
  const ids: bigint[] = []

  for (let tokenId = 0; tokenId < 500; tokenId++) {
    const bigTokenId = BigInt(tokenId)

    try {
      const ownerOf = await client.readContract({
        abi: erc721Abi,
        address: collection,
        functionName: 'ownerOf',
        args: [bigTokenId],
      })

      if (ownerOf.toLowerCase() === user.toLowerCase()) ids.push(bigTokenId)
    } catch {
      continue
    }
  }

  return ids
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
