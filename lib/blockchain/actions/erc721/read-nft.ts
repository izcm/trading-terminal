import { erc721Abi, type Address, type PublicClient } from 'viem'

import type { Result } from '@/lib/utils/http'

import { mapTokenUriToNFT, type NFT } from '@/domain/nft'

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
