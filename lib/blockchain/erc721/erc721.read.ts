import { erc721Abi, type Address } from 'viem'

import type { Page, Result } from '@/lib/utils/http'

import { getPublicClient } from 'wagmi/actions'
import { wagmiConfig } from '../wagmi'

import { mapTokenUriToNFT, type NFT } from '@/domain/nft'

const CHAIN_ID = 31337 // todo: multichain

export async function readOwned(collection: Address, user: Address): Promise<bigint[]> {
  const client = getPublicClient(wagmiConfig, { chainId: CHAIN_ID })

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

export async function readNFT(address: Address, tokenId: bigint): Promise<Result<NFT>> {
  const client = getPublicClient(wagmiConfig, { chainId: CHAIN_ID })

  try {
    const tokenUri = await client.readContract({
      address,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [tokenId],
    })

    return {
      ok: true,
      data: mapTokenUriToNFT(CHAIN_ID, address, tokenId, tokenUri),
    }
  } catch (err) {
    return { ok: false, error: `error reading item: ${err}` }
  }
}

// works only with sequential tokenIds (will switch this stuff out with indexing nfts soon)
// only for dev!!
export async function readNFTBatch(
  address: Address,
  limit: number,
  cursor: number = 0 // i know this is absolutely wild (will remove asap)
): Promise<Result<Page<NFT>>> {
  const client = getPublicClient(wagmiConfig, { chainId: CHAIN_ID })

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
      const tokenId = i + cursor // i know this is absolutely wild (will remove asap)
      return mapTokenUriToNFT(CHAIN_ID, address, BigInt(tokenId), tokenUri)
    })

    return {
      ok: true,
      data: {
        items,
        cursor: null, // todo: make this less clumsy
      },
    }
  } catch (err) {
    return { ok: false, error: `error reading items: ${err}` }
  }
}
